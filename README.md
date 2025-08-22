
# Securi Recipe App (Fullstack)

## Run
1) Start MySQL; create DB `recipesdb`.
2) Backend
   - cd backend
   - cp .env.example .env  # or edit values
   - npm i
   - npm run seed
   - npm run dev
3) Frontend
   - cd frontend
   - npm i
   - npm run dev
4) Or from root:
   - npm run dev

## API
GET /api/recipes?page=1&limit=15
GET /api/recipes/search?title=pie&rating=%3E%3D4.5&calories=%3C%3D400
GET /api/recipes/:id
