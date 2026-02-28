from fastapi import FastAPI

app = FastAPI()

# simple health endpoint
@app.get("/hello")
def hello():
    return {"message": "Hello from Oracle Cloud 🚀"}

# portfolio data
@app.get("/profile")
def profile():
    return {
        "name": "Sanjay Kumar",
        "role": "Full Stack Developer",
        "skills": ["React", "FastAPI", "Docker", "GitHub Actions", "Nginx"],
        "experience": "Built CI/CD deployment pipeline on Oracle Cloud",
        "projects": [
            {"title": "Portfolio DevOps Project", "tech": "React + FastAPI + Docker"},
            {"title": "Monitoring Dashboard", "tech": "Netdata + Nginx Reverse Proxy"}
        ]
    }