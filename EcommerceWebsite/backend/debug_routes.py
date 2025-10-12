from app.main import app

print("🌐 Available API Routes:")
for route in app.routes:
    if hasattr(route, 'path'):
        methods = getattr(route, 'methods', ['ANY'])
        print(f"  {', '.join(methods):<10} {route.path}")
