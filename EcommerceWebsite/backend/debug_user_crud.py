import importlib
import app.crud.user

print("🔍 Contents of app.crud.user:")
for attr in dir(app.crud.user):
    if not attr.startswith('_'):
        print(f"  - {attr}: {getattr(app.crud.user, attr)}")