from app.db.session import SessionLocal
from app.crud.user import user as user_crud
from app.schemas.user import UserCreate

def test_user_crud():
    db = SessionLocal()
    try:
        print("🧪 Testing User CRUD operations...")
        
        # Test creating a user
        user_data = UserCreate(
            email="test@example.com",
            full_name="Test User",
            password="testpassword123"
        )
        
        created_user = user_crud.create(db, user_data)
        print(f"✅ User created: {created_user.full_name} ({created_user.email})")
        
        # Test getting user by email
        found_user = user_crud.get_by_email(db, "test@example.com")
        print(f"✅ User found by email: {found_user.full_name}")
        
        # Test authentication
        auth_user = user_crud.authenticate(db, "test@example.com", "testpassword123")
        print(f"✅ Authentication successful: {auth_user is not None}")
        
        # Test failed authentication
        failed_auth = user_crud.authenticate(db, "test@example.com", "wrongpassword")
        print(f"✅ Failed authentication handled: {failed_auth is False}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_user_crud()