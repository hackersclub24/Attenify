# # seed.py  ← create this in root folder, run once, then delete
# import asyncio
# from app.db import AsyncSessionLocal
# from app.models import User
# from app.routers.auth import hash_password

# async def seed():
#     async with AsyncSessionLocal() as db:
#         admin = User(
#             username="admin",
#             password=hash_password("admin123"),
#             role="admin",
#             email="admin@attenify.com",
#             status="active"
#         )
#         db.add(admin)
#         await db.commit()
#         print("✅ Admin user created!")

# asyncio.run(seed())