import os
from dotenv import load_dotenv

# Load environment variables from backend/.env when running directly
load_dotenv()

from app import create_app

app = create_app()

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=os.getenv('FLASK_ENV') != 'production')
