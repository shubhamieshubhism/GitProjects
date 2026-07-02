# Healenium Setup

Healenium is a self‑healing test automation tool that uses machine learning to find alternative locators when the primary ones fail.  
This folder provides a minimal setup to run Healenium alongside the AI-Augmented QA system.

## Prerequisites

- Docker and Docker Compose
- Java (if running Healenium standalone)

## Services

- **Healenium Backend**: REST API that processes healing requests.
- **Healenium Proxy**: (optional) – a proxy that intercepts Selenium calls to automatically heal locators.
- **PostgreSQL**: used by Healenium to store historical locator data.

## Quick Start

1. Start the Healenium stack:
   ```bash
   docker-compose up -d