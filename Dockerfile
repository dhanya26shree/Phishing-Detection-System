FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy everything else
COPY . .

# Hugging Face Spaces uses port 7860 by default
ENV PORT=7860

# Expose the correct port
EXPOSE 7860

# Run with Gunicorn for production stability
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "backend.app:app", "--bind", "0.0.0.0:7860"]
