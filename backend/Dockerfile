# Use an official Python runtime as a parent image
FROM python:3.13-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y netcat-openbsd && \
    rm -rf /var/lib/apt/lists/*

# Install uv
RUN pip install uv

# Copy the dependency files
COPY pyproject.toml uv.lock ./

# Install dependencies
RUN uv pip install --no-cache --system -r pyproject.toml

# Copy the rest of the application's code
COPY . .

# Expose the port the app runs on
EXPOSE 8000

# Run the application
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["uv", "run", "manage.py", "runserver", "0.0.0.0:8000"]
