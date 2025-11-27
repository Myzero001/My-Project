FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Production image
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# Create SSL directory inside container
# RUN mkdir -p /etc/nginx/ssl

# Copy SSL cert and key into image
# COPY ./certs/fullchain.crt /etc/nginx/ssl/fullchain.crt
# COPY ./certs/airbagmanager.key /etc/nginx/ssl/privkey.key




RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
