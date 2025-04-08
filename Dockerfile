FROM python:3.13-alpine

RUN apk add --no-cache gcc
WORKDIR /app
ENV PYTHONBUFFERED=1
COPY requirements.txt .
RUN pip install --upgrade --no-cache-dir pip && \
  pip install --no-cache-dir -r requirements.txt

COPY . .
EXPOSE 80
CMD ["sh", "-c", "python manage.py makemigrations && python manage.py migrate && python manage.py runserver 0.0.0.0:80"]
