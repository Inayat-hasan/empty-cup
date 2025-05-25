# Use official Python slim image for smaller size
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Flask app
COPY . .

# Expose port (adjust if your Flask app uses a different port)
EXPOSE 5000

# Command to run the Flask app
CMD ["python", "app.py"]
