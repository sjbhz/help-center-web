
# FROM 100.76.10.155:5000/library/bcnginx:v1.20.2
# LABEL maintainer="Erised"
# COPY dist /apps/svr/nginx-1.20.2/html/
# COPY nginx.conf /apps/conf/nginx_80/nginx.conf

FROM nginx
COPY dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf
