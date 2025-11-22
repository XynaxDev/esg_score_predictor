from flask import Blueprint, request, jsonify
from ..services.tokens import auth_required
from ..extensions import mongo
import pandas as pd
import numpy as np
from datetime import datetime
import os
from bson.objectid import ObjectId

analytics_bp = Blueprint('analytics', __name__)


# Load dataset (in-memory cache)
_df = None


def load_data():
    global _df
    if _df is not None:
        return _df
    # Try to load from data/ folder (repo root relative)
    # Inside container: /app/app/analytics/... -> repo root is three parents up (/app)
    repo_root_from_container = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    # Local dev (working inside backend/): repo root is one level above backend/
    repo_root_from_backend = os.path.abspath(os.path.join(repo_root_from_container, '..'))
    candidates = [
        os.path.join(repo_root_from_container, 'data', 'esg_financial_dataset.csv'),
        os.path.join(repo_root_from_backend, 'data', 'esg_financial_dataset.csv'),
    ]
    try:
        for p in candidates:
            if os.path.exists(p):
                _df = pd.read_csv(p)
                break
        if _df is None:
            raise FileNotFoundError('dataset not found')
    except Exception:
        # Sample data fallback
        np.random.seed(42)
        companies = [f"Company_{i}" for i in range(1, 51)]
        industries = ["Retail", "Technology", "Healthcare", "Finance", "Energy"]
        regions = ["North America", "Europe", "Asia", "Latin America"]
        years = range(2015, 2026)
        data = []
        for company in companies:
            for year in years:
                data.append({
                    "CompanyID": int(company.split("_")[1]),
                    "CompanyName": company,
                    "Industry": np.random.choice(industries),
                    "Region": np.random.choice(regions),
                    "Year": year,
                    "Revenue": np.random.uniform(100, 5000),
                    "ProfitMargin": np.random.uniform(-5, 15),
                    "MarketCap": np.random.uniform(100, 20000),
                    "GrowthRate": np.random.uniform(-20, 30),
                    "ESG_Overall": np.random.uniform(40, 80),
                    "ESG_Environmental": np.random.uniform(30, 80),
                    "ESG_Social": np.random.uniform(20, 90),
                    "ESG_Governance": np.random.uniform(30, 85),
                    "CarbonEmissions": np.random.uniform(10000, 300000),
                    "WaterUsage": np.random.uniform(5000, 150000),
                    "EnergyConsumption": np.random.uniform(20000, 600000),
                })
        _df = pd.DataFrame(data)
    return _df


def get_user_dataframe(user_id: str):
    """Return user's active dataset.
    If none exists, return default data only for a seeded test user; for other users return an empty DataFrame with the same schema.
    """
    # Active dataset
    doc = mongo.db.active_datasets.find_one({'user_id': user_id})
    if doc and doc.get('data'):
        try:
            return pd.DataFrame(doc['data'])
        except Exception:
            pass

    # Identify user to decide fallback
    user = mongo.db.users.find_one({'_id': ObjectId(user_id)})
    test_email = os.getenv('SEED_TEST_EMAIL', 'test@esg.local').lower()
    if user and (user.get('email', '').lower() == test_email):
        return load_data()

    # Empty dataset with same columns for new users
    try:
        cols = list(load_data().columns)
    except Exception:
        cols = []
    return pd.DataFrame(columns=cols)


def _coerce_types(df: pd.DataFrame) -> pd.DataFrame:
    if df is None or df.empty:
        return df
    numeric_cols = [
        'Year', 'Revenue', 'ProfitMargin', 'MarketCap', 'GrowthRate',
        'ESG_Overall', 'ESG_Environmental', 'ESG_Social', 'ESG_Governance',
        'CarbonEmissions', 'WaterUsage', 'EnergyConsumption'
    ]
    for c in numeric_cols:
        if c in df.columns:
            df[c] = pd.to_numeric(df[c], errors='coerce')
    # Drop rows with NaN in critical columns minimally
    return df


def apply_filters(df, filters):
    filtered = _coerce_types(df.copy())
    if 'yearRange' in filters:
        year_range = filters['yearRange']
        filtered = filtered[(filtered['Year'] >= year_range[0]) & (filtered['Year'] <= year_range[1])]
    if 'industries' in filters and filters['industries']:
        filtered = filtered[filtered['Industry'].isin(filters['industries'])]
    if 'regions' in filters and filters['regions']:
        filtered = filtered[filtered['Region'].isin(filters['regions'])]
    if 'minESGScore' in filters:
        filtered = filtered[filtered['ESG_Overall'] >= filters['minESGScore']]
    if 'minRevenue' in filters:
        filtered = filtered[filtered['Revenue'] >= filters['minRevenue']]
    if 'maxCarbonEmissions' in filters:
        filtered = filtered[filtered['CarbonEmissions'] <= filters['maxCarbonEmissions']]
    if 'maxEnergyConsumption' in filters:
        filtered = filtered[filtered['EnergyConsumption'] <= filters['maxEnergyConsumption']]
    if 'minGrowthRate' in filters:
        filtered = filtered[filtered['GrowthRate'] >= filters['minGrowthRate']]
    return filtered


@analytics_bp.get('/filters')
@auth_required
def get_filters():
    df = get_user_dataframe(request.user['user_id'])
    if df.empty:
        return jsonify({
            "industries": [],
            "regions": [],
            "yearRange": {"min": 0, "max": 0},
            "revenueRange": {"min": 0.0, "max": 0.0},
            "esgRange": {"min": 0, "max": 100},
        })
    return jsonify({
        "industries": df["Industry"].dropna().unique().tolist(),
        "regions": df["Region"].dropna().unique().tolist(),
        "yearRange": {"min": int(df["Year"].min()), "max": int(df["Year"].max())},
        "revenueRange": {"min": float(df["Revenue"].min()), "max": float(df["Revenue"].max())},
        "esgRange": {"min": 0, "max": 100},
    })


@analytics_bp.post('/overview')
@auth_required
def overview():
    df = get_user_dataframe(request.user['user_id'])
    filters = request.json or {}
    filtered_df = apply_filters(df, filters)
    if filtered_df.empty:
        return jsonify({
            "totalCompanies": 0,
            "avgESGScore": 0.0,
            "avgRevenue": 0.0,
            "avgGrowthRate": 0.0,
            "totalCarbonEmissions": 0.0,
            "avgEnvironmentalScore": 0.0,
            "avgSocialScore": 0.0,
            "avgGovernanceScore": 0.0,
        })
    metrics = {
        "totalCompanies": int(filtered_df["CompanyName"].nunique()),
        "avgESGScore": float(filtered_df["ESG_Overall"].mean()),
        "avgRevenue": float(filtered_df["Revenue"].mean()),
        "avgGrowthRate": float(filtered_df["GrowthRate"].mean()),
        "totalCarbonEmissions": float(filtered_df["CarbonEmissions"].sum()),
        "avgEnvironmentalScore": float(filtered_df["ESG_Environmental"].mean()),
        "avgSocialScore": float(filtered_df["ESG_Social"].mean()),
        "avgGovernanceScore": float(filtered_df["ESG_Governance"].mean()),
    }
    return jsonify(metrics)


@analytics_bp.post('/top-performers')
@auth_required
def top_performers():
    df = get_user_dataframe(request.user['user_id'])
    filters = request.json or {}
    category = filters.get('category', 'overall')
    limit = filters.get('limit', 10)
    filtered_df = apply_filters(df, filters)
    if filtered_df.empty:
        return jsonify([])
    grouped = (
        filtered_df.groupby("CompanyName").agg({
            "ESG_Overall": "mean",
            "ESG_Environmental": "mean",
            "ESG_Social": "mean",
            "ESG_Governance": "mean",
            "Industry": "first",
            "Revenue": "mean",
        }).round(2)
    )
    column_map = {
        'overall': 'ESG_Overall',
        'environmental': 'ESG_Environmental',
        'social': 'ESG_Social',
        'governance': 'ESG_Governance',
    }
    sort_column = column_map.get(category, 'ESG_Overall')
    top = grouped.nlargest(limit, sort_column).reset_index()
    return jsonify(top.to_dict(orient='records'))


@analytics_bp.post('/industry-analysis')
@auth_required
def industry_analysis():
    df = get_user_dataframe(request.user['user_id'])
    filters = request.json or {}
    filtered_df = apply_filters(df, filters)
    if filtered_df.empty:
        return jsonify([])
    stats = (
        filtered_df.groupby("Industry").agg({
            "ESG_Overall": "mean",
            "ESG_Environmental": "mean",
            "ESG_Social": "mean",
            "ESG_Governance": "mean",
            "Revenue": "mean",
            "CarbonEmissions": "mean",
            "CompanyName": "nunique",
        }).round(2).reset_index()
    )
    stats.rename(columns={"CompanyName": "CompanyCount"}, inplace=True)
    return jsonify(stats.to_dict(orient='records'))


@analytics_bp.post('/regional-insights')
@auth_required
def regional_insights():
    df = get_user_dataframe(request.user['user_id'])
    filters = request.json or {}
    filtered_df = apply_filters(df, filters)
    if filtered_df.empty:
        return jsonify([])
    stats = (
        filtered_df.groupby("Region").agg({
            "ESG_Overall": "mean",
            "ESG_Environmental": "mean",
            "ESG_Social": "mean",
            "ESG_Governance": "mean",
            "Revenue": "mean",
            "CarbonEmissions": "mean",
            "CompanyName": "nunique",
        }).round(2).reset_index()
    )
    stats.rename(columns={"CompanyName": "CompanyCount"}, inplace=True)
    return jsonify(stats.to_dict(orient='records'))


@analytics_bp.post('/trends')
@auth_required
def trends():
    df = get_user_dataframe(request.user['user_id'])
    filters = request.json or {}
    filtered_df = apply_filters(df, filters)
    if filtered_df.empty:
        return jsonify([])
    tr = (
        filtered_df.groupby("Year").agg({
            "ESG_Overall": "mean",
            "ESG_Environmental": "mean",
            "ESG_Social": "mean",
            "ESG_Governance": "mean",
            "Revenue": "mean",
            "CarbonEmissions": "mean",
            "GrowthRate": "mean",
        }).round(2).reset_index()
    )
    return jsonify(tr.to_dict(orient='records'))


@analytics_bp.post('/correlations')
@auth_required
def correlations():
    df = get_user_dataframe(request.user['user_id'])
    filters = request.json or {}
    filtered_df = apply_filters(df, filters)
    if filtered_df.empty:
        return jsonify({})
    cols = ['ESG_Overall', 'Revenue', 'ProfitMargin', 'GrowthRate', 'CarbonEmissions']
    corr = filtered_df[cols].corr().round(3)
    return jsonify(corr.to_dict())


@analytics_bp.post('/export')
@auth_required
def export_data():
    df = get_user_dataframe(request.user['user_id'])
    filters = request.json or {}
    filtered_df = apply_filters(df, filters)
    if filtered_df.empty:
        return jsonify({'data': [], 'count': 0})
    return jsonify({
        'data': filtered_df.to_dict(orient='records'),
        'count': len(filtered_df)
    })


# --- ML metadata endpoints ---

@analytics_bp.post('/predictions')
@auth_required
def save_prediction():
    body = request.get_json() or {}
    user_id = request.user['user_id']
    doc = {
        'user_id': user_id,
        'model': body.get('model'),             # e.g., 'random_forest_v1'
        'inputs': body.get('inputs'),           # raw features
        'output': body.get('output'),           # prediction result
        'metrics': body.get('metrics'),         # optional metrics
        'tags': body.get('tags', []),
        'created_at': datetime.utcnow(),
    }
    mongo.db.predictions.insert_one(doc)
    doc['id'] = str(doc.pop('_id', ''))
    return jsonify({'message': 'Prediction saved', 'prediction': doc}), 201


@analytics_bp.get('/predictions')
@auth_required
def list_predictions():
    user_id = request.user['user_id']
    # filters & pagination
    search = request.args.get('search', '').strip()
    tag = request.args.get('tag')
    model = request.args.get('model')
    try:
        page = max(1, int(request.args.get('page', 1)))
        limit = max(1, min(100, int(request.args.get('limit', 10))))
    except Exception:
        page, limit = 1, 10
    query = {'user_id': user_id}
    if search:
        query['$or'] = [
            {'model': {'$regex': search, '$options': 'i'}},
            {'tags': {'$elemMatch': {'$regex': search, '$options': 'i'}}},
        ]
    if tag:
        query['tags'] = {'$elemMatch': {'$regex': f'^{tag}$', '$options': 'i'}}
    if model:
        query['model'] = {'$regex': model, '$options': 'i'}
    total = mongo.db.predictions.count_documents(query)
    cursor = mongo.db.predictions.find(query).sort('created_at', -1).skip((page-1)*limit).limit(limit)
    items = []
    for d in cursor:
        d['id'] = str(d.pop('_id'))
        ca = d.get('created_at')
        if isinstance(ca, datetime):
            d['created_at'] = ca.isoformat()
        items.append(d)
    return jsonify({'items': items, 'total': total, 'page': page, 'limit': limit, 'pages': (total + limit - 1)//limit})


@analytics_bp.delete('/predictions/<pid>')
@auth_required
def delete_prediction(pid):
    user_id = request.user['user_id']
    try:
        mongo.db.predictions.delete_one({'_id': ObjectId(pid), 'user_id': user_id})
    except Exception:
        return jsonify({'error': 'Invalid prediction id'}), 400
    return jsonify({'message': 'Prediction deleted'})


@analytics_bp.put('/predictions/<pid>')
@auth_required
def update_prediction(pid):
    user_id = request.user['user_id']
    body = request.get_json() or {}
    update = {}
    if 'tags' in body:
        update['tags'] = body['tags']
    if 'notes' in body:
        update['notes'] = body['notes']
    if not update:
        return jsonify({'error': 'Nothing to update'}), 400
    try:
        mongo.db.predictions.update_one({'_id': ObjectId(pid), 'user_id': user_id}, {'$set': update})
    except Exception:
        return jsonify({'error': 'Invalid prediction id'}), 400
    return jsonify({'message': 'Prediction updated'})


@analytics_bp.get('/model-status')
@auth_required
def get_model_status():
    """Check if model is configured in backend"""
    model_url = os.getenv('WATSONX_MODEL_URL', '').strip()
    model_name = os.getenv('WATSONX_MODEL_NAME', 'WatsonX ESG Predictor')
    
    if not model_url:
        return jsonify({
            'configured': False,
            'message': 'Model endpoint not configured. Please set WATSONX_MODEL_URL in backend environment.'
        })
    
    return jsonify({
        'configured': True,
        'model_name': model_name,
        'message': 'Model ready for predictions'
    })


@analytics_bp.post('/predict')
@auth_required
def make_prediction():
    import requests
    user_id = request.user['user_id']
    body = request.get_json() or {}
    inputs = body.get('inputs', {})
    
    if not inputs:
        return jsonify({'error': 'Input features are required'}), 400
    
    # Get model URL from environment
    model_url = os.getenv('WATSONX_MODEL_URL', '').strip()
    model_name = os.getenv('WATSONX_MODEL_NAME', 'WatsonX ESG Predictor')
    
    if not model_url:
        return jsonify({'error': 'Model not configured on server. Contact administrator.'}), 503
    
    try:
        # Call external model API
        response = requests.post(
            model_url,
            json={'inputs': inputs},
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        response.raise_for_status()
        result = response.json()
        
        prediction_value = result.get('prediction', result.get('output', None))
        
        # Save prediction to DB
        pred_doc = {
            'user_id': user_id,
            'model': model_name,
            'inputs': inputs,
            'output': prediction_value,
            'raw_response': result,
            'tags': ['auto'],
            'created_at': datetime.utcnow()
        }
        res = mongo.db.predictions.insert_one(pred_doc)
        pred_doc['id'] = str(res.inserted_id)
        
        return jsonify({
            'message': 'Prediction successful',
            'prediction': prediction_value,
            'details': result,
            'saved_id': pred_doc['id']
        })
    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'Model API error: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500


@analytics_bp.post('/predict-batch')
@auth_required
def predict_batch():
    """Batch prediction from uploaded CSV/XLSX"""
    import requests
    user_id = request.user['user_id']
    body = request.get_json() or {}
    data = body.get('data', [])
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    # Get model URL from environment
    model_url = os.getenv('WATSONX_MODEL_URL', '').strip()
    model_name = os.getenv('WATSONX_MODEL_NAME', 'WatsonX ESG Predictor')
    
    if not model_url:
        return jsonify({'error': 'Model not configured on server. Contact administrator.'}), 503
    
    results = []
    errors = []
    
    for idx, row in enumerate(data):
        try:
            # Call external model API
            response = requests.post(
                model_url,
                json={'inputs': row},
                headers={'Content-Type': 'application/json'},
                timeout=30
            )
            response.raise_for_status()
            result = response.json()
            prediction_value = result.get('prediction', result.get('output', None))
            
            # Save prediction to DB
            pred_doc = {
                'user_id': user_id,
                'model': model_name,
                'inputs': row,
                'output': prediction_value,
                'raw_response': result,
                'tags': ['batch'],
                'created_at': datetime.utcnow()
            }
            res = mongo.db.predictions.insert_one(pred_doc)
            
            results.append({
                'row': idx,
                'prediction': prediction_value,
                'id': str(res.inserted_id)
            })
        except Exception as e:
            errors.append({'row': idx, 'error': str(e)})
    
    return jsonify({
        'message': f'Batch prediction complete. {len(results)} succeeded, {len(errors)} failed.',
        'results': results,
        'errors': errors
    })


@analytics_bp.get('/predictions/analytics')
@auth_required
def predictions_analytics():
    user_id = request.user['user_id']
    
    # Get all predictions for this user
    preds = list(mongo.db.predictions.find({'user_id': user_id}))
    
    if not preds:
        return jsonify({
            'total_predictions': 0,
            'models_used': [],
            'predictions_over_time': [],
            'output_distribution': [],
            'recent_predictions': []
        })
    
    # Total count
    total = len(preds)
    
    # Models used
    models = {}
    for p in preds:
        m = p.get('model', 'Unknown')
        models[m] = models.get(m, 0) + 1
    models_list = [{'model': k, 'count': v} for k, v in models.items()]
    
    # Predictions over time (group by date)
    time_series = {}
    for p in preds:
        created = p.get('created_at')
        if created:
            date_key = created.strftime('%Y-%m-%d') if isinstance(created, datetime) else str(created)[:10]
            time_series[date_key] = time_series.get(date_key, 0) + 1
    time_list = sorted([{'date': k, 'count': v} for k, v in time_series.items()], key=lambda x: x['date'])
    
    # Output distribution (if numeric)
    outputs = []
    for p in preds:
        out = p.get('output')
        if out is not None:
            try:
                outputs.append(float(out))
            except (ValueError, TypeError):
                pass
    
    output_dist = []
    if outputs:
        # Create bins
        min_val, max_val = min(outputs), max(outputs)
        if min_val < max_val:
            bins = np.linspace(min_val, max_val, 6)
            hist, edges = np.histogram(outputs, bins=bins)
            for i in range(len(hist)):
                output_dist.append({
                    'range': f'{edges[i]:.1f}-{edges[i+1]:.1f}',
                    'count': int(hist[i])
                })
    
    # Recent predictions
    recent = sorted(preds, key=lambda x: x.get('created_at', datetime.min), reverse=True)[:10]
    recent_list = []
    for p in recent:
        recent_list.append({
            'id': str(p['_id']),
            'model': p.get('model'),
            'output': p.get('output'),
            'created_at': p.get('created_at').isoformat() if isinstance(p.get('created_at'), datetime) else None
        })
    
    return jsonify({
        'total_predictions': total,
        'models_used': models_list,
        'predictions_over_time': time_list,
        'output_distribution': output_dist,
        'recent_predictions': recent_list
    })


@analytics_bp.post('/uploads')
@auth_required
def save_upload_metadata():
    body = request.get_json() or {}
    user_id = request.user['user_id']
    doc = {
        'user_id': user_id,
        'filename': body.get('filename'),
        'content_type': body.get('content_type'),
        'size_bytes': body.get('size_bytes'),
        'columns': body.get('columns'),         # schema info
        'notes': body.get('notes'),
        'created_at': datetime.utcnow(),
    }
    mongo.db.uploads.insert_one(doc)
    doc['id'] = str(doc.pop('_id', ''))
    return jsonify({'message': 'Upload recorded', 'upload': doc}), 201


@analytics_bp.get('/uploads')
@auth_required
def list_uploads():
    user_id = request.user['user_id']
    search = (request.args.get('search') or '').strip()
    try:
        page = max(1, int(request.args.get('page', 1)))
        limit = max(1, min(100, int(request.args.get('limit', 10))))
    except Exception:
        page, limit = 1, 10
    query = {'user_id': user_id}
    if search:
        query['filename'] = {'$regex': search, '$options': 'i'}
    total = mongo.db.uploads.count_documents(query)
    cursor = mongo.db.uploads.find(query).sort('created_at', -1).skip((page-1)*limit).limit(limit)
    items = []
    for d in cursor:
        d['id'] = str(d.pop('_id'))
        items.append(d)
    return jsonify({'items': items, 'total': total, 'page': page, 'limit': limit, 'pages': (total + limit - 1)//limit})


@analytics_bp.get('/uploads/<uid>/preview')
@auth_required
def preview_upload(uid):
    user_id = request.user['user_id']
    try:
        oid = ObjectId(uid)
    except Exception:
        return jsonify({'error': 'Invalid upload id'}), 400
    meta = mongo.db.uploads.find_one({'_id': oid, 'user_id': user_id})
    if not meta:
        return jsonify({'error': 'Not found'}), 404
    ds = mongo.db.user_datasets.find_one({'upload_id': oid, 'user_id': user_id}, {'data': 1, 'columns': 1})
    sample = []
    columns = meta.get('columns', [])
    if ds and ds.get('data'):
        columns = ds.get('columns') or columns
        sample = (ds.get('data') or [])[:10]
    return jsonify({
        'upload': {
            'id': uid,
            'filename': meta.get('filename'),
            'row_count': meta.get('row_count'),
            'columns': columns,
            'created_at': (meta.get('created_at').isoformat() if isinstance(meta.get('created_at'), datetime) else meta.get('created_at')),
        },
        'columns': columns,
        'sample': sample,
    })


@analytics_bp.post('/uploads/<uid>/analyze')
@auth_required
def analyze_upload(uid):
    user_id = request.user['user_id']
    try:
        oid = ObjectId(uid)
    except Exception:
        return jsonify({'error': 'Invalid upload id'}), 400
    ds = mongo.db.user_datasets.find_one({'upload_id': oid, 'user_id': user_id})
    if not ds:
        return jsonify({'error': 'Dataset not found for this upload'}), 404
    columns = ds.get('columns') or []
    data = ds.get('data') or []
    if not data or not columns:
        return jsonify({'error': 'Invalid dataset'}), 400
    mongo.db.active_datasets.update_one(
        {'user_id': user_id},
        {'$set': {'data': data, 'columns': columns, 'filename': ds.get('filename'), 'upload_id': oid, 'updated_at': datetime.utcnow()}},
        upsert=True,
    )
    # Also materialize to a local CSV for reference (data/active_dataset.csv)
    try:
        repo_root_from_container = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
        repo_root_from_backend = os.path.abspath(os.path.join(repo_root_from_container, '..'))
        data_dir = os.path.join(repo_root_from_container, 'data') if os.path.isdir(os.path.join(repo_root_from_container, 'data')) else os.path.join(repo_root_from_backend, 'data')
        os.makedirs(data_dir, exist_ok=True)
        out_path = os.path.join(data_dir, 'active_dataset.csv')
        pd.DataFrame(data).to_csv(out_path, index=False)
    except Exception:
        pass
    return jsonify({'message': 'Active dataset set'})


@analytics_bp.delete('/uploads/<uid>')
@auth_required
def delete_upload(uid):
    user_id = request.user['user_id']
    try:
        oid = ObjectId(uid)
    except Exception:
        return jsonify({'error': 'Invalid upload id'}), 400
    mongo.db.uploads.delete_one({'_id': oid, 'user_id': user_id})
    mongo.db.user_datasets.delete_one({'upload_id': oid, 'user_id': user_id})
    # If this upload was the active dataset, clear it so UI falls back to empty state
    mongo.db.active_datasets.delete_one({'user_id': user_id, 'upload_id': oid})
    return jsonify({'message': 'Upload deleted'})


@analytics_bp.get('/uploads/<uid>/download')
@auth_required
def download_upload(uid):
    user_id = request.user['user_id']
    fmt = (request.args.get('format') or 'json').lower()
    try:
        oid = ObjectId(uid)
    except Exception:
        return jsonify({'error': 'Invalid upload id'}), 400
    ds = mongo.db.user_datasets.find_one({'upload_id': oid, 'user_id': user_id})
    if not ds:
        return jsonify({'error': 'Dataset not found'}), 404
    data = ds.get('data') or []
    if fmt == 'csv':
        if not data:
            return jsonify({'error': 'No data'}), 400
        df = pd.DataFrame(data)
        csv_text = df.to_csv(index=False)
        return jsonify({'filename': ds.get('filename') or 'dataset.csv', 'content': csv_text})
    else:
        return jsonify({'data': data, 'columns': ds.get('columns') or []})


@analytics_bp.post('/upload-dataset')
@auth_required
def upload_dataset():
    user_id = request.user['user_id']
    body = request.get_json() or {}
    filename = body.get('filename')
    data = body.get('data', [])
    columns = body.get('columns', [])

    if not data or not columns:
        return jsonify({'error': 'Invalid dataset'}), 400

    # Validate required schema
    required = [
        'CompanyName', 'Industry', 'Region', 'Year', 'Revenue',
        'ESG_Overall', 'ESG_Environmental', 'ESG_Social', 'ESG_Governance'
    ]
    missing = [c for c in required if c not in columns]
    if missing:
        return jsonify({'error': 'Missing required columns', 'missing': missing}), 400

    # Store upload metadata
    meta = {
        'user_id': user_id,
        'filename': filename,
        'row_count': len(data),
        'columns': columns,
        'created_at': datetime.utcnow(),
    }
    res = mongo.db.uploads.insert_one(meta)
    upload_id = res.inserted_id

    # Persist full dataset for preview/analyze/download
    try:
        mongo.db.user_datasets.insert_one({
            'user_id': user_id,
            'upload_id': upload_id,
            'filename': filename,
            'columns': columns,
            'data': data,
            'created_at': datetime.utcnow(),
        })
    except Exception:
        pass

    return jsonify({
        'message': 'Dataset uploaded successfully',
        'upload': {
            'id': str(upload_id),
            'filename': filename,
            'row_count': len(data),
            'columns': columns,
            'created_at': meta['created_at'].isoformat()
        }
    }), 201
