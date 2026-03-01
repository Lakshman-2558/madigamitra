# Deployment Guide for Matrimony Catalog

## Deployment Options

### Backend Deployment

#### Option 1: Heroku

```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create matrimony-backend

# Set environment variables
heroku config:set -a matrimony-backend MONGODB_URI=<your_mongodb_uri>
heroku config:set -a matrimony-backend JWT_SECRET=<strong_secret>
heroku config:set -a matrimony-backend CLOUDINARY_NAME=<name>
heroku config:set -a matrimony-backend CLOUDINARY_API_KEY=<key>
heroku config:set -a matrimony-backend CLOUDINARY_API_SECRET=<secret>

# Deploy
git push heroku main
```

#### Option 2: Railway

1. Connect GitHub repo
2. Add variables in Railway dashboard
3. Auto-deploys on push

#### Option 3: AWS EC2

```bash
# SSH into instance
ssh -i key.pem ec2-user@your-instance

# Install Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18

# Install PM2 (process manager)
npm install -g pm2

# Clone repo and setup
git clone <repo>
cd matrimony/backend
npm install

# Start with PM2
pm2 start server.js --name "matrimony"
pm2 startup
pm2 save
```

### Frontend Deployment

#### Option 1: Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel
```

#### Option 2: Netlify

```bash
# Build frontend
npm run build

# Deploy dist/ folder to Netlify
# Or connect GitHub and auto-deploy
```

#### Option 3: AWS S3 + CloudFront

```bash
# Build
npm run build

# Upload dist/ to S3
# Configure CloudFront CDN
# Point domain to CloudFront
```

### Database Hosting

#### MongoDB Atlas (Recommended for free tier)

1. Create cluster at mongodb.com/cloud/atlas
2. Add IP whitelist (0.0.0.0/0 dev, specific IPs prod)
3. Create database user
4. Get connection string
5. Add to MONGODB_URI in production env

#### Self-hosted MongoDB on EC2

```bash
# Install MongoDB
sudo apt-get install -y mongodb

# Start service
sudo systemctl start mongod
sudo systemctl enable mongod

# Secure with firewall (allow only app server)
```

## Environment Variables for Production

### Backend Production .env

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/matrimony
JWT_SECRET=<generate-with-crypto>
CLOUDINARY_NAME=<production-account>
CLOUDINARY_API_KEY=<production-key>
CLOUDINARY_API_SECRET=<production-secret>
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
```

### Frontend Production .env

```env
VITE_API_URL=https://api.yourdomain.com/api
```

## SSL/TLS Certificate

Use Let's Encrypt (free):

```bash
# Using Certbot
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d yourdomain.com
```

## Performance Optimization

```bash
# Build frontend optimally
npm run build

# Check bundle size
npm run build -- --analyze
```

## Monitoring & Logging

### Application Logging

```javascript
// Winston logger
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});
```

### Uptime Monitoring

- Use Uptime Robot (free tier)
- Monitor /api/health endpoint
- Set alerts for downtime

### Performance Monitoring

- New Relic (free tier)
- Datadog
- AWS CloudWatch

## Backup Strategy

### MongoDB Backups

```bash
# Manual backup
mongodump --uri="mongodb+srv://..." --out backup/

# Restore
mongorestore --uri="mongodb+srv://..." ./backup/
```

### Enable Atlas Backups

- Enable in MongoDB Atlas dashboard
- Set daily backups
- Configure retention policy

## CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install dependencies
        run: |
          cd backend && npm install
          cd ../frontend && npm install

      - name: Run tests
        run: |
          cd backend && npm test
          cd ../frontend && npm test

      - name: Deploy backend
        run: git push heroku main

      - name: Deploy frontend
        run: npm run build && vercel --prod
```

## Security Checklist

- ✅ Change admin password in production
- ✅ Use strong JWT_SECRET (32+ chars)
- ✅ Enable HTTPS/SSL
- ✅ Set CORS to specific domain
- ✅ Use MongoDB Atlas IP whitelist
- ✅ Enable MongoDB password authentication
- ✅ Set NODE_ENV=production
- ✅ Use environment variables for secrets
- ✅ Enable API rate limiting
- ✅ Set up WAF (Web Application Firewall)

## Cost Estimates (Free Tier)

- **MongoDB Atlas**: Free tier - 512MB storage
- **Heroku**: $7/month dyno (Heroku is paid now)
- **Railway**: $5/month credit
- **AWS S3 + CloudFront**: Free tier - 1GB bandwidth
- **Cloudinary**: Free tier - 25GB storage
- **Vercel/Netlify**: Free for frontend

**Total**: $0-7/month (if using Railway + MongoDB Atlas + Vercel)

---

For production deployment, always:

1. Use environment variables for secrets
2. Enable HTTPS/SSL
3. Set up monitoring & logging
4. Configure backups
5. Implement rate limiting
6. Use CDN for static files
7. Have CI/CD pipeline
