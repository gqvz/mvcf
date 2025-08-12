# MVC-frontend

Run (without Docker)
```bash
npm install
npm run dev
```

# Run (with Docker)
```bash
# you can use https://mvc.gqvz.xyz/api as backend_url
docker build --build-arg NEXT_PUBLIC_BASE_URL="backend_url" -t mvcf:latest .
docker run -e PORT=8080 -p 8080:8080 --rm --name mvcf mvcf:latest
```

or just go to https://mvc.gqvz.xyz