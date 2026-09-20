# Docker for Developers — A 14-Day Plan
### For QA/testers transitioning into development

---

## The Big Picture (in plain English)

Docker is a tool that packages your application **together with everything it needs to run** (the right language version, libraries, system tools, config) into a single sealed box called a *container*. That box runs identically on your laptop, your teammate's laptop, the CI server, and production — which means "it works on my machine" stops being an argument and starts being a guarantee. You describe the box once in a text file (a `Dockerfile`), Docker builds it into a reusable snapshot (an *image*), and you can start, stop, throw away, and recreate copies of that box in seconds. As a developer, Docker is mostly about two things: **running other people's stuff without installing it** (databases, queues, mock services) and **shipping your own stuff in a predictable package**.

---

## Your 14-Day Map

| Days | Theme | You'll be able to... |
|---|---|---|
| 1–2 | Fundamentals + mental model | Run containers, explain images vs containers |
| 3–5 | Images & Dockerfiles | Write and build your own Dockerfile |
| 6–8 | Containers in practice | Use volumes, ports, logs, container networking |
| 9–11 | Docker Compose | Run a multi-service app with one command |
| 12–13 | CI/CD + debugging | Use Docker in a pipeline, fix broken builds |
| 14 | Mini project | Ship a web app + database + volume, end to end |

Each day: 45–90 minutes. Don't skip the hands-on parts — Docker is muscle memory.

---

# Day 1 — What Docker Actually Is (and Running Your First Container)

**Time: ~60 minutes**

### Why this matters for a developer

Before you write a single Dockerfile, you need the right mental model. Most Docker confusion later ("why did my data disappear?", "why can't I reach localhost?") comes from a fuzzy understanding of what a container *is*. Today you build that foundation and get an immediate win: running a real web server without installing a web server.

### Simple explanation (with analogies)

**Analogy 1 — Shipping containers.**
Before shipping containers, moving goods meant custom-packing every ship, truck, and train differently. The container standardized the *outside* so any crane, ship, or truck could handle it, without caring what's inside. Docker does this for software: the outside is standard, so any machine with Docker can run it, without caring whether it's Python, Java, or Node inside.

**Analogy 2 — Recipe vs. cooked meal.**
- **Dockerfile** = the recipe (written instructions)
- **Image** = a frozen, ready-to-heat meal made from that recipe (read-only snapshot)
- **Container** = the meal on your plate, being eaten (a running instance)

You can make many containers from one image, the same way you can heat many frozen meals from one batch. Eating one doesn't change the frozen batch.

> **New terms, one line each:**
> - **Image** — a read-only snapshot of a filesystem + instructions on what to run.
> - **Container** — a running (or stopped) instance of an image, with its own isolated filesystem and processes.
> - **Daemon** — a background program that's always running and does work when asked. Docker's daemon is the thing that actually builds images and starts containers.
> - **Registry** — a place images are stored and downloaded from. Docker Hub is the default public one. Think "npm/PyPI, but for images."
> - **Docker CLI** — the `docker` command you type. It just sends requests to the daemon.

### Diagram 1 — Docker architecture

```
   YOU                    YOUR MACHINE                        INTERNET
 ┌───────┐        ┌──────────────────────────────┐        ┌──────────────┐
 │  CLI  │        │      DOCKER DAEMON           │        │   REGISTRY   │
 │ docker│ ─────► │  (the engine doing the work) │ ─────► │  Docker Hub  │
 │  run  │  REST  │                              │  pull  │              │
 └───────┘  API   │  ┌────────────────────────┐  │ ◄───── │  nginx:1.27  │
                  │  │   LOCAL IMAGE CACHE    │  │  push  │  postgres:16 │
                  │  │  nginx  postgres  node │  │        │  node:20     │
                  │  └───────────┬────────────┘  │        └──────────────┘
                  │              │ creates       │
                  │              ▼               │
                  │  ┌────────────────────────┐  │
                  │  │      CONTAINERS        │  │
                  │  │  [web] [db] [worker]   │  │
                  │  └────────────────────────┘  │
                  └──────────────────────────────┘
```

**Read it as:** you type a command → the CLI asks the daemon → the daemon checks if the image is already local → if not, it downloads it from the registry → then it creates a container from that image.

### Diagram 2 — VM vs Container (why containers are fast)

```
      VIRTUAL MACHINES                      CONTAINERS
 ┌─────┐ ┌─────┐ ┌─────┐              ┌─────┐ ┌─────┐ ┌─────┐
 │ App │ │ App │ │ App │              │ App │ │ App │ │ App │
 ├─────┤ ├─────┤ ├─────┤              ├─────┤ ├─────┤ ├─────┤
 │ Libs│ │ Libs│ │ Libs│              │ Libs│ │ Libs│ │ Libs│
 ├─────┤ ├─────┤ ├─────┤              └──┬──┘ └──┬──┘ └──┬──┘
 │GUEST│ │GUEST│ │GUEST│  ← heavy!       └───────┼───────┘
 │ OS  │ │ OS  │ │ OS  │                        ▼
 └──┬──┘ └──┬──┘ └──┬──┘              ┌────────────────────┐
    └───────┼───────┘                 │   DOCKER ENGINE    │
            ▼                         ├────────────────────┤
   ┌──────────────────┐               │     HOST OS        │  ← ONE OS, shared
   │    HYPERVISOR    │               ├────────────────────┤
   ├──────────────────┤               │     HARDWARE       │
   │     HOST OS      │               └────────────────────┘
   ├──────────────────┤
   │    HARDWARE      │              Boot time: ~1 second
   └──────────────────┘              Size: ~50–200 MB
   Boot time: ~1 minute
   Size: ~2–20 GB
```

| | Virtual Machine | Container |
|---|---|---|
| Contains | Full guest OS + app | Just app + its libraries |
| Startup | 30s – 2 min | 0.5 – 2 seconds |
| Typical size | 2–20 GB | 50–500 MB |
| Isolation | Very strong (separate OS) | Strong (shared OS kernel) |
| How many on a laptop | 2–3 | 20–30 easily |
| Best for | Running a different OS | Running apps consistently |

**Key takeaway:** a container is *not* a tiny VM. It's a normal process on your machine that has been given a fenced-off view of the filesystem, network, and process list. That's why it starts instantly.

### Commands to try

```bash
docker --version          # Check Docker is installed and CLI works
docker info               # Detailed status of the daemon (is it actually running?)
docker run hello-world    # Download + run a tiny test image
docker images             # List images downloaded on your machine
docker ps                 # List RUNNING containers
docker ps -a              # List ALL containers, including stopped ones
docker rm <container_id>  # Delete a stopped container
docker rmi <image_name>   # Delete an image
```

**Roughly what you'll see:**

```
$ docker run hello-world
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
c1ec31eb5944: Pull complete
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.
```

```
$ docker ps -a
CONTAINER ID   IMAGE         COMMAND    CREATED          STATUS                      NAMES
a1b2c3d4e5f6   hello-world   "/hello"   10 seconds ago   Exited (0) 9 seconds ago    boring_mirzakhani
```

Notice: `STATUS = Exited (0)`. The container ran, printed, finished, and stopped. **A container lives only as long as its main process runs.** That single sentence explains 30% of beginner confusion.

### Hands-on activity (20 min)

**Goal: prove to yourself that containers are isolated and disposable.**

**Step 1 — Run a real web server you never installed:**
```bash
docker run -d -p 8080:80 --name my-web nginx
```
- `-d` = detached (run in background)
- `-p 8080:80` = forward your machine's port 8080 → container's port 80
- `--name my-web` = give it a friendly name instead of a random one

Open `http://localhost:8080` in your browser. You're looking at a web server that is not installed on your computer.

**Step 2 — Look inside:**
```bash
docker exec -it my-web bash     # Open a shell INSIDE the running container
```
Then inside, run:
```bash
ls /                # See the container's own filesystem
cat /etc/os-release # Often a different Linux distro than your host!
echo "hello QA" > /tmp/test.txt
exit
```

**Step 3 — Prove the isolation is real:**
```bash
docker stop my-web
docker rm my-web
docker run -d -p 8080:80 --name my-web nginx
docker exec -it my-web cat /tmp/test.txt
```
You'll get `No such file or directory`. Your file is gone. **Containers are disposable and forget everything by default.** (Day 7 covers volumes — how to make data survive.)

**Step 4 — Clean up:**
```bash
docker stop my-web && docker rm my-web
```

### QA → Dev bridge

| What you already know from testing | Docker equivalent |
|---|---|
| A clean test environment reset before each run | A fresh container from an image — identical every time |
| "It passed on the test env but failed on staging" | Solved by shipping the *same image* everywhere |
| A test data snapshot you restore from | An image — a frozen known-good state |
| Spinning up a test env and tearing it down | `docker run` / `docker rm` in ~2 seconds |
| A base VM image your team clones | A Docker image, but 100x smaller and faster |

Think of an image as **a golden test environment snapshot that anyone can restore in one second**, and a container as **one restored copy of it that you're free to trash**.

### Common beginner mistakes (Day 1 edition)

1. **"My container exited immediately!"** — It didn't crash. Its main process finished. `docker run ubuntu` exits instantly because there's nothing to do. Use `docker run -it ubuntu bash` to keep it alive with an interactive shell.
2. **Confusing images and containers.** `docker ps` shows containers. `docker images` shows images. `docker rm` deletes containers, `docker rmi` deletes images.
3. **Forgetting `-a` on `docker ps`.** Stopped containers are invisible without it, and they pile up eating disk space.
4. **Getting the port order backwards.** `-p HOST:CONTAINER`. Always. `-p 8080:80` means "my 8080 goes to its 80."
5. **Editing files inside a container and expecting them to persist.** They won't survive `docker rm`. That's by design.

### Day 1 done when you can

- [ ] Explain the difference between an image and a container in one sentence
- [ ] Run nginx, see it in your browser, and remove it cleanly
- [ ] Explain why your `/tmp/test.txt` disappeared

---

# Day 2 — The Container Lifecycle & The Flags You'll Actually Use

**Time: ~60 min**

### Why this matters
90% of your daily Docker use is `docker run` with 4–5 flags. Knowing the lifecycle tells you *why* a container is stopped, missing, or unreachable — which is most of your future debugging.

### Simple explanation
A container is like a **hotel room booking**. `run` = book and check in. `stop` = you leave, room stays reserved with your stuff. `start` = come back to the same room. `rm` = check out, room is cleaned, stuff is gone. `run` again = a brand-new room.

The critical rule from Day 1, restated: **a container lives exactly as long as its main process (PID 1) lives.** When that process exits, the container stops. Nothing else keeps it alive.

### Diagram — lifecycle

```
                        docker run
                             │
          ┌──────────────────┼───────────────────┐
          │                  ▼                   │
   [IMAGE] ──create──► [CREATED] ──start──► [RUNNING] ──┐
                                     ▲          │       │
                             start   │          │ stop  │ main process
                                     │          ▼       │ exits on its own
                                  [STOPPED] ◄───────────┘
                                     │
                                    rm
                                     │
                                     ▼
                                  [GONE]   ← filesystem changes destroyed

   pause/unpause: RUNNING <──> PAUSED   (freezes processes, rarely needed)
   restart = stop + start
```

### Commands to try
```bash
docker run -it ubuntu bash          # -it = interactive terminal, keeps it alive
docker run -d nginx                 # -d = detached, runs in background
docker run --rm alpine echo hi      # --rm = auto-delete container when it exits
docker run -e APP_ENV=test alpine env   # -e = set an environment variable
docker start <name>                 # Restart a stopped container (same filesystem)
docker stop <name>                  # Graceful stop (SIGTERM, then kill after 10s)
docker kill <name>                  # Immediate stop, no grace period
docker restart <name>               # stop + start
docker logs <name>                  # Print the container's stdout/stderr
docker logs -f <name>               # Follow logs live, like tail -f
docker rm -f <name>                 # Force-remove even if running
```

**Output sample:**
```
$ docker run -it ubuntu bash
root@7f3a9c1e5d2b:/# whoami
root
root@7f3a9c1e5d2b:/# exit
$ docker ps -a
CONTAINER ID   IMAGE    STATUS                     NAMES
7f3a9c1e5d2b   ubuntu   Exited (0) 3 seconds ago   nifty_hopper
```

### The flags worth memorising

| Flag | Meaning | When you use it |
|---|---|---|
| `-d` | Detached / background | Servers, databases |
| `-it` | Interactive + TTY | Shells, debugging |
| `-p H:C` | Publish host port → container port | Anything you open in a browser |
| `--name` | Friendly name | Always. Random names waste your time |
| `--rm` | Delete on exit | One-off commands, scripts |
| `-e KEY=val` | Environment variable | Config, secrets, DB passwords |
| `-v` | Mount a volume/folder | Day 7 |
| `--network` | Attach to a network | Day 8 |

### Hands-on (20 min)
```bash
# 1. Start a container, write a file, stop it, start it again
docker run -dit --name lifecycle-test ubuntu bash
docker exec -it lifecycle-test bash -c "echo 'I survived' > /data.txt"
docker stop lifecycle-test
docker start lifecycle-test
docker exec -it lifecycle-test cat /data.txt     # -> "I survived"  stop/start keeps data

# 2. Now destroy it
docker rm -f lifecycle-test
docker run -dit --name lifecycle-test ubuntu bash
docker exec -it lifecycle-test cat /data.txt     # -> No such file   rm wipes it

# 3. Environment variables
docker run --rm -e GREETING="hello dev" alpine sh -c 'echo $GREETING'

# 4. See exit codes
docker run --name failer alpine sh -c "exit 3"
docker ps -a --filter name=failer   # STATUS shows Exited (3)
docker rm failer
```

### QA → Dev bridge
- `docker stop`/`start` = **suspending a test VM** — state preserved.
- `docker rm` + `run` = **rebuilding the test env from scratch** — guaranteed clean.
- Exit codes are exactly like **test-runner exit codes**: `0` = pass, non-zero = fail. CI reads these the same way.
- `docker logs` is your **test execution log**. It's the first place you look when something fails.

### Mistakes
1. Using `docker run` when you meant `docker start` — you keep creating new containers and wondering why your changes vanished.
2. Forgetting `-d` on a server, then your terminal is stuck.
3. Not using `--name`, then hunting through `docker ps -a` for `elated_wozniak`.
4. Using `docker kill` habitually — it skips graceful shutdown; databases hate this.

---

# Day 3 — Images and Layers

**Time: ~60 min**

### Why this matters
Understanding layers is the difference between a 1.2 GB image that rebuilds in 4 minutes and a 90 MB image that rebuilds in 3 seconds. Your CI pipeline time depends on this.

### Simple explanation
An image is **a stack of transparent sheets** (like old overhead projector slides). Each sheet adds or changes something. Stack them and you see the final picture. Each sheet is a **layer**, and layers are **shared and cached**.

If ten images all start `FROM node:20`, that node layer is downloaded and stored **once** on your machine. That's why the first pull is slow and the rest are fast.

Crucially: **layers are read-only**. When you run a container, Docker adds one thin **writable layer** on top. All your changes go there. Delete the container → delete that layer → changes gone. That's the Day-1 mystery, solved.

### Diagram — layers and the writable layer

```
 CONTAINER A              CONTAINER B          ← each gets its own thin
┌──────────────┐        ┌──────────────┐         writable layer (R/W)
│ writable R/W │        │ writable R/W │
└──────┬───────┘        └──────┬───────┘
       └────────────┬──────────┘
                    ▼
        ┌───────────────────────┐
        │  IMAGE (read-only)    │
        ├───────────────────────┤
        │ L4: CMD ["node","app"]│  ← tiny, metadata
        │ L3: COPY . /app       │  ← your source code
        │ L2: RUN npm install   │  ← your dependencies (BIG)
        │ L1: FROM node:20      │  ← base OS + node (BIG, shared)
        └───────────────────────┘
```

### Image names explained
```
   registry.example.com / myteam / myapp : 1.4.2
   └──── registry ─────┘  └─repo─┘ └name┘ └tag┘

   nginx              ->  docker.io/library/nginx:latest
   postgres:16        ->  docker.io/library/postgres:16
```
> **Tag** — a label pointing at a specific image version. `latest` is *not* "newest" — it's just the default tag name. Never rely on it.

### Commands
```bash
docker pull postgres:16        # Download an image without running it
docker images                  # List local images + sizes
docker history nginx           # Show every layer and its size — very revealing
docker inspect nginx           # Full JSON metadata: env vars, ports, entrypoint
docker tag nginx my-nginx:v1   # Give an existing image another name
docker rmi my-nginx:v1         # Remove an image tag
docker image prune             # Delete dangling (untagged, orphaned) images
docker system df               # How much disk Docker is eating
```

**Output sample:**
```
$ docker history python:3.12-slim
IMAGE          CREATED       CREATED BY                              SIZE
a1b2c3d4e5f6   2 weeks ago   CMD ["python3"]                         0B
<missing>      2 weeks ago   RUN /bin/sh -c set -eux; wget -O pyth…  38.2MB
<missing>      2 weeks ago   ENV PYTHON_VERSION=3.12.4               0B
<missing>      3 weeks ago   /bin/sh -c #(nop) ADD file:8d3f…        74.8MB
```

### Hands-on (20 min)
```bash
# 1. Compare image sizes for the same language
docker pull python:3.12
docker pull python:3.12-slim
docker pull python:3.12-alpine
docker images | grep python
# You'll see roughly 1GB vs 130MB vs 50MB. Same Python.

# 2. See where the weight lives
docker history python:3.12-slim

# 3. Prove layer sharing: pull two images with the same base
docker pull node:20-alpine
docker pull redis:7-alpine
# The second pull reuses the alpine layer — notice "Already exists" lines

# 4. Check total disk usage
docker system df
```

### QA → Dev bridge
- Layers = **incremental test-data snapshots**. You don't rebuild the whole DB, you apply the next delta.
- A tag is like a **build number on a release artifact**. `latest` is like testing "whatever's on main right now" — unreproducible, and you already know that's a bad idea.
- Pinning `postgres:16.3` instead of `postgres:latest` is the same discipline as pinning a browser version in your test grid.

### Mistakes
1. Using `:latest` in a Dockerfile or compose file. Your build works today, breaks in three weeks, and nothing in your repo changed.
2. Never pruning. Docker will quietly consume 40 GB.
3. Assuming a bigger image is "more complete" — `-slim` and `-alpine` are usually all you need.

---

# Day 4 — Writing Your First Dockerfile

**Time: ~75 min**

### Why this matters
This is the single most important developer skill in Docker. It's the file you'll add to your repo, review in PRs, and maintain.

### Simple explanation
A Dockerfile is **a recipe written for a robot chef who has never cooked before and has no ingredients**. You must say everything: start from this base, install these, copy these files in, and here's the command to run when someone orders.

### Diagram — the core flow

```
 ┌─────────────┐   docker build -t myapp:1.0 .   ┌─────────────┐
 │ Dockerfile  │ ──────────────────────────────► │    IMAGE    │
 │  (recipe)   │                                 │  (snapshot) │
 └─────────────┘                                 └──────┬──────┘
       ▲                                                │
       │ you write it                       docker run -p 3000:3000 myapp:1.0
       │                                                │
  ┌────┴──────┐                          ┌──────────────┼──────────────┐
  │ your repo │                          ▼              ▼              ▼
  │ + source  │                    ┌──────────┐  ┌──────────┐  ┌──────────┐
  └───────────┘                    │container1│  │container2│  │container3│
                                   └──────────┘  └──────────┘  └──────────┘
                   docker push ──► REGISTRY ──► teammates / CI / production
```

### The instructions you need (that's genuinely all of them)

| Instruction | What it does | Example |
|---|---|---|
| `FROM` | Choose the base image. Always first. | `FROM node:20-alpine` |
| `WORKDIR` | Set the current directory inside the image (creates it) | `WORKDIR /app` |
| `COPY` | Copy files from your machine into the image | `COPY package.json .` |
| `RUN` | Execute a command **at build time**, creates a layer | `RUN npm ci` |
| `ENV` | Set an environment variable in the image | `ENV NODE_ENV=production` |
| `EXPOSE` | Document which port the app listens on | `EXPOSE 3000` |
| `ARG` | A variable available only during build | `ARG VERSION=1.0` |
| `USER` | Run as a non-root user | `USER node` |
| `CMD` | Default command **at run time** | `CMD ["node", "server.js"]` |
| `ENTRYPOINT` | The fixed command; `CMD` becomes its arguments | `ENTRYPOINT ["python"]` |

**`RUN` vs `CMD` — the #1 confusion:**
- `RUN` happens **while building** the image (installing things). Runs many times, once per build.
- `CMD` happens **when starting** a container. Runs once per container start. Only the last `CMD` counts.

### A real Dockerfile, line by line
```dockerfile
FROM node:20-alpine
# Start from a small Linux with Node 20 preinstalled

WORKDIR /app
# All following commands run here; like `cd /app`

COPY package*.json ./
# Copy ONLY dependency files first — this is the caching trick (Day 5)

RUN npm ci --omit=dev
# Install dependencies at build time

COPY . .
# Now copy the rest of the source code

ENV NODE_ENV=production
EXPOSE 3000
# Documentation only — does NOT publish the port. You still need -p

USER node
# Don't run as root

CMD ["node", "server.js"]
# What runs when the container starts
```

### Commands
```bash
docker build -t myapp:1.0 .          # Build; -t = tag/name; "." = build context
docker build -t myapp:1.0 -f Dockerfile.dev .   # Use a differently-named file
docker build --no-cache -t myapp:1.0 .          # Ignore cache, rebuild everything
docker run -p 3000:3000 myapp:1.0
```

> **Build context** — the folder you pass as `.`. Docker zips it up and sends it to the daemon. If that folder has `node_modules` or a 2 GB `.git`, your build is slow. Fix it with `.dockerignore` (Day 5).

**Output sample:**
```
$ docker build -t myapp:1.0 .
[+] Building 12.4s (10/10) FINISHED
 => [internal] load build definition from Dockerfile       0.0s
 => [1/5] FROM docker.io/library/node:20-alpine            3.1s
 => [2/5] WORKDIR /app                                     0.1s
 => [3/5] COPY package*.json ./                            0.0s
 => [4/5] RUN npm ci --omit=dev                            8.2s
 => [5/5] COPY . .                                         0.1s
 => exporting to image                                     0.6s
 => => naming to docker.io/library/myapp:1.0
```

### Hands-on (25 min)
Create a folder `docker-practice/`:

**`server.js`**
```javascript
const http = require('http');
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.end(`Hello from inside a container! Host: ${require('os').hostname()}\n`);
}).listen(PORT, () => console.log(`Listening on ${PORT}`));
```

**`package.json`**
```json
{ "name": "docker-practice", "version": "1.0.0", "main": "server.js" }
```

**`Dockerfile`** — write it yourself using the template above (skip `npm ci`, there are no deps; skip `USER node` for now).

Then:
```bash
docker build -t myapp:1.0 .
docker run -d -p 3000:3000 --name myapp myapp:1.0
curl http://localhost:3000
docker logs myapp
docker rm -f myapp
```
Then change the message in `server.js`, rebuild, rerun. Notice the rebuild is much faster.

### QA → Dev bridge
A Dockerfile is **your environment setup document, but executable**. Every team has a stale `SETUP.md` that says "install Java 11, set JAVA_HOME…". A Dockerfile is that document that can't go stale, because if it's wrong, the build fails immediately. It's the difference between a test plan and an automated test.

### Mistakes
1. Thinking `EXPOSE 3000` publishes the port. It doesn't. You still need `-p 3000:3000`.
2. Binding your server to `127.0.0.1` inside the container — then it's unreachable from outside. **Always bind to `0.0.0.0`.** This is a top-3 beginner trap.
3. `COPY . .` before installing dependencies — destroys your cache (Day 5).
4. Putting `RUN npm start` instead of `CMD ["npm","start"]` — the build hangs forever.
5. Forgetting the `.` at the end of `docker build -t name .`

---

# Day 5 — Better Images: Caching, .dockerignore, Multi-Stage

**Time: ~75 min**

### Why this matters
This is what separates "I can write a Dockerfile" from "I write Dockerfiles my team doesn't complain about." It's also where you'll cut CI times from 8 minutes to 90 seconds.

### Simple explanation — the cache
Docker builds top to bottom. For each instruction it asks: *"Have I done this exact step, with these exact inputs, before?"* If yes, it reuses the cached layer instantly. **The moment one step changes, every step after it is rebuilt.**

So: **put the things that rarely change at the top, and the things that change constantly at the bottom.** Your dependencies change monthly; your source code changes every 5 minutes.

### Diagram — cache invalidation

```
  BAD ORDER                           GOOD ORDER
 ┌──────────────────────┐           ┌──────────────────────────┐
 │ FROM node:20-alpine  │ cached    │ FROM node:20-alpine      │ cached
 │ WORKDIR /app         │ cached    │ WORKDIR /app             │ cached
 │ COPY . .             │ ← CHANGED │ COPY package*.json ./    │ cached
 │ RUN npm ci           │ ← REBUILD │ RUN npm ci               │ cached
 │ CMD [...]            │ ← REBUILD │ COPY . .                 │ ← CHANGED
 └──────────────────────┘           │ CMD [...]                │ ← rebuild (0s)
   Every code change =              └──────────────────────────┘
   full npm install (90s)             Code change = 2 seconds
```

### `.dockerignore`
Same idea as `.gitignore`, but for the build context. Create it next to your Dockerfile:
```
node_modules
.git
.env
*.log
dist
coverage
Dockerfile
docker-compose.yml
.vscode
__pycache__
```
Without it, `COPY . .` drags your local `node_modules` (built for your OS) into a Linux image. This causes bizarre, hard-to-diagnose failures.

### COPY vs ADD

| | `COPY` | `ADD` |
|---|---|---|
| Copies local files/folders | yes | yes |
| Auto-extracts local tar archives | no | yes |
| Downloads from a URL | no | yes (but don't) |
| Predictable | yes | no |
| **Use this** | **Always** | Only for local tar extraction |

**Rule: use `COPY`.** Use `ADD` only when extracting a local `.tar.gz`. For URLs, use `RUN curl` so you can verify checksums and clean up in the same layer.

### Multi-stage builds
For compiled languages or anything with a build step, you need the compiler to *build* but not to *run*. Multi-stage lets you throw the heavy tooling away.

```
  STAGE 1: "builder"                 STAGE 2: final image
 ┌────────────────────────┐        ┌────────────────────────┐
 │ FROM node:20 AS builder│        │ FROM nginx:alpine      │
 │ npm ci (dev deps too)  │        │                        │
 │ npm run build          │──────► │ COPY --from=builder \  │
 │                        │ only   │   /app/dist /usr/share │
 │ 1.1 GB                 │ the    │                        │
 └────────────────────────┘ output │ 48 MB                  │
   discarded entirely              └────────────────────────┘
```

```dockerfile
# ---- Stage 1: build ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Stage 2: run ----
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Commands
```bash
docker build -t myapp:2.0 .
docker build --no-cache -t myapp:2.0 .        # Prove the cache is helping you
docker build --target builder -t myapp:dbg .  # Build only up to a named stage
docker images myapp                            # Compare sizes before/after
docker history myapp:2.0                       # Find the fat layer
```

### Hands-on (25 min)
Using your Day 4 project:
1. Add a real dependency: `npm install express` and rewrite `server.js` to use it.
2. Write the Dockerfile the **bad** way (`COPY . .` then `RUN npm ci`). Build. Time it. Change one line in `server.js`. Rebuild. Time it again.
3. Reorder it the **good** way. Repeat the experiment. Compare.
4. Add a `.dockerignore` with `node_modules` and `.git`. Rebuild and watch the "load build context" step shrink.
5. Run `docker images` and note the size.

### QA → Dev bridge
Build caching is **exactly** test-suite optimisation. You already know not to re-seed the entire database before every single test — you set up the expensive shared fixture once and only reset the cheap per-test state. Dockerfile ordering is the same instinct: expensive-and-stable first, cheap-and-volatile last.

`.dockerignore` is your **test artifact exclusion list** — don't ship logs, screenshots, and local junk into the thing you're shipping.

### Mistakes
1. No `.dockerignore`. Slow builds, leaked `.env` secrets into the image.
2. `RUN apt-get update` in a separate layer from `apt-get install` — the cached update is stale and install fails weeks later. Always chain: `RUN apt-get update && apt-get install -y x && rm -rf /var/lib/apt/lists/*`
3. Thinking `rm`ing a file in a later layer shrinks the image. It doesn't — the file is still in the earlier layer. Delete in the **same** `RUN`.
4. Baking secrets in with `ENV API_KEY=...`. Anyone with the image can run `docker history` and read it.

---

# Day 6 — Containers in Practice: Inspect, Exec, Logs, Cleanup

**Time: ~50 min**

### Why this matters
This is your day-to-day toolkit. When a colleague says "the container's broken," these are the five commands you run.

### Simple explanation
Think of a running container as **a locked room with a one-way window**. `docker logs` = reading what it shouts out the window. `docker exec` = getting a key and walking in. `docker inspect` = reading the room's blueprint and booking details. `docker stats` = watching its power meter.

### Diagram — your debugging toolkit

```
                     ┌─────────────────────────────┐
                     │     RUNNING CONTAINER       │
                     └──────────────┬──────────────┘
         ┌──────────────┬───────────┼───────────┬──────────────┐
         ▼              ▼           ▼           ▼              ▼
   docker logs    docker exec  docker inspect docker stats  docker top
   "what did      "let me go   "how was it    "is it        "what
    it print?"     look inside" configured?"   hogging CPU?"  processes?"
         │              │           │           │              │
    stdout/stderr   a shell     JSON: env,    live CPU/    process list
                    inside      ports, IP,     memory
                                mounts
```

### Commands
```bash
docker logs myapp                    # All output so far
docker logs -f --tail 50 myapp       # Follow, starting from last 50 lines
docker logs --since 10m myapp        # Only the last 10 minutes
docker exec -it myapp sh             # Shell inside (use sh for alpine, bash for debian)
docker exec myapp env                # Run one command, see env vars
docker exec -u root -it myapp sh     # Get in as root even if image uses USER
docker inspect myapp                 # Everything, as JSON
docker inspect -f '{{.State.ExitCode}}' myapp        # Extract one field
docker inspect -f '{{.NetworkSettings.IPAddress}}' myapp
docker stats                         # Live resource usage, all containers
docker top myapp                     # Processes running inside
docker port myapp                    # Show port mappings
docker cp myapp:/app/log.txt ./      # Copy a file OUT of a container
docker cp ./fix.conf myapp:/etc/     # Copy a file IN
docker diff myapp                    # Files changed since the image was created
```

**Cleanup (run this weekly):**
```bash
docker container prune       # Remove all stopped containers
docker image prune -a        # Remove all unused images
docker volume prune          # Remove unused volumes  (deletes data!)
docker system prune          # Containers + networks + dangling images
docker system prune -a --volumes   # Nuclear. Frees a lot. Know what you're doing.
```

**Output sample:**
```
$ docker stats --no-stream
CONTAINER ID   NAME     CPU %   MEM USAGE / LIMIT   MEM %   NET I/O
a1b2c3d4e5f6   myapp    0.21%   38.4MiB / 7.67GiB   0.49%   1.2kB / 0B
```

### Hands-on (20 min)
```bash
# 1. Run something noisy
docker run -d --name noisy alpine sh -c 'i=0; while true; do echo "tick $i"; i=$((i+1)); sleep 1; done'
docker logs -f --tail 5 noisy      # Ctrl+C to exit

# 2. Go inside and poke around
docker exec -it noisy sh
  ps aux          # See the processes — very few!
  env
  exit

# 3. Extract specific config
docker inspect -f '{{.Config.Cmd}}' noisy
docker inspect -f '{{.State.StartedAt}}' noisy

# 4. See what a container changed
docker exec noisy touch /newfile.txt
docker diff noisy      # -> A /newfile.txt   (A=added, C=changed, D=deleted)

# 5. Copy something out
docker exec noisy sh -c "echo report > /tmp/r.txt"
docker cp noisy:/tmp/r.txt ./r.txt
cat r.txt

docker rm -f noisy
```

### QA → Dev bridge
- `docker logs` = **your test run log file**. First stop, always.
- `docker exec -it` = **remote-desktopping into the test machine** to see why the app won't start.
- `docker cp` = **pulling screenshots/reports off the test agent** after a CI run.
- `docker inspect` = **reading the environment's config dump** to check which build/settings were actually used — the "what version was actually deployed?" question.

### Mistakes
1. Running `bash` in an alpine container. Alpine has no bash. Use `sh`.
2. Making fixes with `docker exec` and forgetting to put them in the Dockerfile. The fix disappears on next rebuild and you've "fixed" nothing.
3. `docker system prune -a --volumes` without reading the prompt. Goodbye, local database.
4. Not checking `docker logs` before asking for help. It's almost always right there.

---

# Day 7 — Volumes and Bind Mounts (Making Data Survive)

**Time: ~75 min**

### Why this matters
Two everyday needs: your database shouldn't lose data when you restart, and you want code changes to appear instantly without rebuilding. Both are mounts.

### Simple explanation
A container's filesystem is **a whiteboard — wiped when you leave the room**. A mount is **plugging in a USB drive**: whatever you write to that folder goes outside the container and survives.

Two kinds:
- **Volume** — Docker manages the storage somewhere on your disk. You just name it. *"Give me a locker; I don't care where."* -> for **databases and app data**.
- **Bind mount** — you point at a specific folder on your machine. *"Use THIS folder, right here."* -> for **source code during development**.

### Diagram — volume mounting

```
   YOUR MACHINE (host)                         CONTAINER
 ┌──────────────────────────┐          ┌──────────────────────────┐
 │                          │          │                          │
 │  /home/you/project/src ──┼──────────┼─► /app/src               │  BIND MOUNT
 │       (you edit here)    │  live    │   (app reads here)       │  code -> instant
 │                          │  2-way   │                          │
 │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │          │ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─│
 │                          │          │                          │
 │  docker volume "pgdata" ─┼──────────┼─► /var/lib/postgresql/   │  VOLUME
 │  (managed by Docker,     │ survives │   (DB writes here)       │  data persists
 │   you never touch it)    │  rm      │                          │
 └──────────────────────────┘          └──────────────────────────┘
                                        everything else here = ephemeral
```

### Decision flowchart

```
                  Do I need data to survive `docker rm`?
                          │
              ┌───── NO ──┴── YES ─────┐
              ▼                        ▼
      Nothing needed.        Do I need to SEE/EDIT these
      (Use tmpfs if it's     files from my host machine?
       secrets/scratch.)              │
                           ┌─── NO ───┴─── YES ───┐
                           ▼                      ▼
                    ┌─────────────┐        ┌──────────────┐
                    │   VOLUME    │        │  BIND MOUNT  │
                    │ -v pgdata:  │        │ -v "$(pwd)": │
                    │   /var/lib  │        │   /app       │
                    ├─────────────┤        ├──────────────┤
                    │ databases   │        │ source code  │
                    │ uploads     │        │ config files │
                    │ caches      │        │ test outputs │
                    │ prod-safe   │        │ DEV ONLY     │
                    └─────────────┘        └──────────────┘
```

### Volume vs bind mount

| | Volume | Bind mount |
|---|---|---|
| Syntax | `-v myvol:/path` | `-v /host/path:/path` |
| Who manages storage | Docker | You |
| Visible in your file explorer | No | Yes |
| Portable across machines | Yes | No (paths differ) |
| Good for | Databases, persistent app data | Live-reload dev code |
| Safe in production | Yes | Generally no |
| Performance on Mac/Windows | Fast | Can be slow |

### Commands
```bash
docker volume create pgdata          # Create a named volume
docker volume ls                     # List volumes
docker volume inspect pgdata         # Where it lives, when created
docker volume rm pgdata              # Delete it (data gone)

# Attach a volume
docker run -d --name db -v pgdata:/var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=secret postgres:16

# Attach a bind mount (note: absolute path required)
docker run -d -p 3000:3000 -v "$(pwd)":/app -w /app node:20-alpine node server.js

# Read-only bind mount — safer for config
docker run -v "$(pwd)/config.yml":/etc/app/config.yml:ro myapp

# Modern equivalent syntax (more explicit, recommended in compose)
docker run --mount type=volume,src=pgdata,dst=/var/lib/postgresql/data postgres:16
docker run --mount type=bind,src="$(pwd)",dst=/app node:20-alpine
```

### Hands-on (25 min)
```bash
# 1. Database WITHOUT a volume — watch data die
docker run -d --name db1 -e POSTGRES_PASSWORD=secret postgres:16
sleep 10
docker exec -it db1 psql -U postgres -c "CREATE TABLE t(id int); INSERT INTO t VALUES (42);"
docker exec -it db1 psql -U postgres -c "SELECT * FROM t;"     # -> 42
docker rm -f db1
docker run -d --name db1 -e POSTGRES_PASSWORD=secret postgres:16
sleep 10
docker exec -it db1 psql -U postgres -c "SELECT * FROM t;"     # -> ERROR: relation "t" does not exist
docker rm -f db1

# 2. Now WITH a volume
docker volume create pgdata
docker run -d --name db2 -v pgdata:/var/lib/postgresql/data -e POSTGRES_PASSWORD=secret postgres:16
sleep 10
docker exec -it db2 psql -U postgres -c "CREATE TABLE t(id int); INSERT INTO t VALUES (42);"
docker rm -f db2
docker run -d --name db2 -v pgdata:/var/lib/postgresql/data -e POSTGRES_PASSWORD=secret postgres:16
sleep 10
docker exec -it db2 psql -U postgres -c "SELECT * FROM t;"     # -> 42  SURVIVED
docker rm -f db2

# 3. Bind mount for live editing
cd your-day4-project
docker run -d -p 3000:3000 --name live -v "$(pwd)":/app -w /app node:20-alpine node server.js
curl localhost:3000
# Now edit server.js on your machine, then:
docker restart live
curl localhost:3000     # Changed, with NO rebuild
docker rm -f live
```

### QA → Dev bridge
- Volumes = **your persistent test database** that survives environment rebuilds, so you don't re-seed every time.
- Bind mounts = **pointing your test runner at your local test scripts** instead of a packaged copy — edit, rerun, no redeploy.
- The volume-vs-bind decision is the same as **"shared fixture data vs. working files I'm actively editing."**

### Mistakes
1. **The `node_modules` trap.** `-v "$(pwd)":/app` overwrites the container's `/app/node_modules` with your host's (which may be missing or built for the wrong OS). Fix: add an **anonymous volume** to shield it: `-v "$(pwd)":/app -v /app/node_modules`
2. Using relative paths: `-v ./src:/app` fails on some setups. Use `"$(pwd)"/src`.
3. `docker volume prune` while your local DB container is merely *stopped* — data gone.
4. Bind-mounting in production. Defeats the entire point of a self-contained image.
5. Forgetting quotes around `"$(pwd)"` when your path has spaces.

---

# Day 8 — Networking Basics (Just Enough)

**Time: ~60 min**

### Why this matters
You need exactly one thing: getting your app container to talk to your database container, and both reachable from your browser. That's it.

### Simple explanation
Each container is **an apartment in a building**. Containers on the same Docker network are in the same building — they can knock on each other's doors by **name**. `-p` is **installing a doorbell on the street** so people outside can reach one specific apartment.

The single most important fact: **inside a container, `localhost` means "this container, right here."** Not your laptop. Not the other container. This causes more beginner pain than anything else.

> To reach the DB from your app container: use the **container name** (`postgres:5432`), not `localhost`.
> To reach your laptop from inside a container: use `host.docker.internal`.

### Diagram — networking

```
  YOUR BROWSER
       │ http://localhost:3000
       ▼
 ═════════════════════════ HOST MACHINE ═══════════════════════════
       │
       │  -p 3000:3000  (published port)
       ▼
 ┌─────────────────────── docker network: "app-net" ──────────────┐
 │                                                                 │
 │   ┌──────────────┐                     ┌──────────────┐        │
 │   │   web        │  postgres://db:5432 │     db       │        │
 │   │ listens 3000 │ ───────────────────►│ listens 5432 │        │
 │   │              │  GOOD: by NAME      │              │        │
 │   └──────────────┘                     └──────────────┘        │
 │                                                                 │
 │   BAD:  web -> localhost:5432 = "me, port 5432" = refused      │
 │   GOOD: web -> db:5432        = Docker DNS resolves "db"       │
 │                                                                 │
 │   db has NO -p flag -> not reachable from your browser.         │
 │   That's correct and secure. Only publish what needs publishing.│
 └─────────────────────────────────────────────────────────────────┘
```

### Network types (you need one)

| Type | What it does | Use it? |
|---|---|---|
| **bridge (user-defined)** | Private network, name-based DNS between containers | **This one** |
| bridge (default) | The one you get automatically. No DNS by name. | Avoid |
| host | Container shares host's network directly, no `-p` | Rarely; Linux only |
| none | No networking at all | Isolated batch jobs |

### Commands
```bash
docker network create app-net              # Create a user-defined bridge network
docker network ls                          # List networks
docker network inspect app-net             # See which containers are attached
docker run -d --name db --network app-net postgres:16
docker run -d --name web --network app-net -p 3000:3000 myapp
docker network connect app-net some-container    # Attach an existing container
docker network disconnect app-net some-container
docker network rm app-net
```

### Hands-on (20 min)
```bash
# 1. Prove the default network has no name resolution
docker run -d --name c1 alpine sleep 600
docker run -d --name c2 alpine sleep 600
docker exec c1 ping -c 2 c2        # -> bad address 'c2'  FAILS

# 2. Now with a user-defined network
docker network create app-net
docker rm -f c1 c2
docker run -d --name c1 --network app-net alpine sleep 600
docker run -d --name c2 --network app-net alpine sleep 600
docker exec c1 ping -c 2 c2        # -> 64 bytes from c2 ... WORKS

# 3. Real scenario: app talks to DB by name
docker run -d --name db --network app-net -e POSTGRES_PASSWORD=secret postgres:16
docker run --rm --network app-net postgres:16 \
  psql postgresql://postgres:secret@db:5432/postgres -c "SELECT version();"
# Works — resolved "db" by name, no -p needed anywhere

# 4. Prove localhost is wrong
docker run --rm --network app-net postgres:16 \
  psql postgresql://postgres:secret@localhost:5432/postgres -c "SELECT 1;"
# -> connection refused. Remember this error, you WILL see it again.

# Cleanup
docker rm -f c1 c2 db && docker network rm app-net
```

### QA → Dev bridge
- A user-defined network is **an isolated test environment with its own internal DNS** — exactly like a dedicated QA subnet where services find each other by hostname.
- Not publishing the DB port = **the same reason your staging DB isn't on the public internet**.
- `localhost` confusion is the containerised version of a config pointing at the wrong environment — the classic "my test hit prod" family of bug.

### Mistakes
1. **Using `localhost` inside a container** to reach another container. Use the container name.
2. Publishing everything: `-p 5432:5432` on your DB conflicts with a locally installed Postgres and exposes it needlessly.
3. Port already in use: `Error: bind: address already in use`. Something else has 3000. Use `-p 3001:3000`.
4. Expecting containers on *different* networks to see each other. They can't.

---

# Day 9 — Docker Compose: The Basics

**Time: ~60 min**

### Why this matters
Days 1–8 taught you the manual way. Nobody types six `docker run` commands with twelve flags each, twice a day. Compose turns your whole local environment into one file and one command. This is *the* daily-driver developer tool.

### Simple explanation
If a Dockerfile is a **recipe for one dish**, `docker-compose.yml` is **the menu for the whole meal** — it says which dishes, in what order, sharing which table. One command cooks everything.

> **Docker Compose** — a tool that reads a YAML file describing multiple containers and runs them together as one unit.

### Diagram — compose

```
                    docker-compose.yml
                           │
                    docker compose up
                           │
                           ▼
        ┌──── auto-created network: myapp_default ────┐
        │                                              │
        │  ┌────────────┐      ┌────────────┐         │
        │  │  service:  │      │  service:  │         │
        │  │    web     │─────►│     db     │         │
        │  │ build: .   │ "db" │ image:     │         │
        │  │ ports:     │      │  postgres  │         │
        │  │  3000:3000 │      │            │         │
        │  └─────┬──────┘      └──────┬─────┘         │
        │        │                    │               │
        └────────┼────────────────────┼───────────────┘
                 │                    │
            published            ┌────▼─────┐
            to host:3000         │ volume:  │
                                 │  pgdata  │  ← survives `down`
                                 └──────────┘

  Compose gives you FOR FREE:
    - a shared network       - name-based DNS between services
    - dependency ordering    - one-command up/down
```

### Your first compose file
```yaml
services:
  web:
    build: .                    # Build from the Dockerfile in this folder
    ports:
      - "3000:3000"             # host:container
    environment:
      DATABASE_URL: postgresql://postgres:secret@db:5432/appdb
    depends_on:
      - db                      # Start db first (does NOT wait for it to be READY)

  db:
    image: postgres:16          # Use a prebuilt image
    environment:
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: appdb
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:                       # Declare the named volume
```

That's it. No `version:` line needed anymore — it's obsolete and Compose warns about it.

### The keys you need

| Key | Meaning |
|---|---|
| `services` | The list of containers |
| `build: .` | Build from a local Dockerfile |
| `image: x` | Use a published image instead |
| `ports` | Publish `"host:container"` — **always quote them** |
| `environment` | Env vars for the container |
| `env_file` | Load env vars from a `.env` file |
| `volumes` | Volumes and bind mounts |
| `depends_on` | Start order |
| `command` | Override the image's `CMD` |
| `restart` | `unless-stopped` is the useful one |

### Commands
```bash
docker compose up                # Start everything, logs in foreground
docker compose up -d             # Start in background
docker compose up --build        # Rebuild images first  <- you'll use this constantly
docker compose down              # Stop and remove containers + network
docker compose down -v           # ...and DELETE volumes (careful!)
docker compose ps                # What's running
docker compose logs -f web       # Follow logs for one service
docker compose exec web sh       # Shell into a running service
docker compose run --rm web npm test   # One-off command in a NEW container
docker compose build web         # Rebuild just one service
docker compose restart web
docker compose stop              # Stop without removing
docker compose config            # Validate + print the resolved file
```

> Note: modern Docker uses `docker compose` (space). Older tutorials say `docker-compose` (hyphen). Both usually work; prefer the space.

**Output sample:**
```
$ docker compose up -d
[+] Running 4/4
 - Network myapp_default    Created
 - Volume "myapp_pgdata"    Created
 - Container myapp-db-1     Started
 - Container myapp-web-1    Started
```

### Hands-on (25 min)
In your Day 4/5 project folder, create `docker-compose.yml`:
```yaml
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      MESSAGE: "hello from compose"
  cache:
    image: redis:7-alpine
```
Then:
```bash
docker compose up -d
docker compose ps
curl localhost:3000
docker compose exec web sh -c 'echo $MESSAGE'
docker compose exec web ping -c 2 cache      # name resolution works automatically
docker compose logs -f web                   # Ctrl+C
docker compose down
docker compose config                        # See the fully-resolved config
```

### QA → Dev bridge
`docker-compose.yml` is **your environment-provisioning script, versioned in the repo**. You've seen teams where spinning up the full stack for testing takes a half-day of following wiki instructions. Compose makes it `docker compose up` — and because it's in Git, environment changes go through code review like everything else.

`docker compose run --rm web npm test` is the containerised **test execution command** — same one locally and in CI.

### Mistakes
1. **YAML indentation.** Spaces only, never tabs. Two spaces per level. This will bite you.
2. Unquoted ports. `- 5000:5000` is fine but `- 8080:80` in some edge cases gets parsed oddly. Quote them: `- "8080:80"`.
3. **Thinking `depends_on` waits for readiness.** It waits for the container to *start*, not for Postgres to accept connections. Your app will crash on first connect. Fix with a healthcheck (Day 11) or retry logic in your app.
4. Running `docker compose down -v` casually. That `-v` deletes your database.
5. Still using `version: "3.8"` at the top. Remove it.

---

# Day 10 — A Real Multi-Service App with Compose

**Time: ~90 min**

### Why this matters
Today you build the thing you'll actually work with daily: app + database + cache, wired together, with persistence. This is a dress rehearsal for Day 14.

### Simple explanation
You're going from "a container" to "a system." The mental shift: each service does **one job**, and they find each other by **name**. Your app doesn't know or care where Postgres is running — it just connects to `db`.

### Diagram — the full local stack

```
  Browser ──► localhost:3000
                   │
  ══════════════ HOST ══════════════════════════════════════
                   │ published
  ┌────────────────▼──────── network: app_default ─────────┐
  │                                                         │
  │   ┌─────────┐    db:5432      ┌──────────┐             │
  │   │   web   │ ───────────────►│    db    │──► [pgdata] │
  │   │ (build:)│                 │postgres16│    volume   │
  │   │         │ ───────────────►┌──────────┐             │
  │   └─────────┘  cache:6379     │  cache   │             │
  │        ▲                      │ redis:7  │             │
  │        │                      └──────────┘             │
  │   bind mount                                            │
  └────────┼────────────────────────────────────────────────┘
           │
   ./src on your machine  ← edit code, see it live
```

### The compose file
```yaml
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:secret@db:5432/appdb
      REDIS_URL: redis://cache:6379
      NODE_ENV: development
    volumes:
      - ./src:/app/src          # bind mount: live code
      - /app/node_modules       # anonymous volume: protect deps
    depends_on:
      db:
        condition: service_healthy
      cache:
        condition: service_started
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: appdb
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 3s
      retries: 10
    ports:
      - "5433:5432"             # 5433 to avoid clashing with local postgres

  cache:
    image: redis:7-alpine
    volumes:
      - redisdata:/data

volumes:
  pgdata:
  redisdata:
```

> **Healthcheck** — a command Docker runs periodically inside the container to decide whether it's actually ready, not just started. `condition: service_healthy` makes `depends_on` genuinely wait.

> **`/docker-entrypoint-initdb.d/`** — a special Postgres folder. Any `.sql` file dropped there runs automatically the first time the volume is created. Free database seeding.

### Commands
```bash
docker compose up -d --build
docker compose logs -f
docker compose ps                        # Check health status column
docker compose exec db psql -U postgres -d appdb
docker compose exec cache redis-cli ping
docker compose restart web
docker compose down                      # keeps volumes
docker compose down -v                   # wipes volumes, forces init.sql to rerun
```

**Output sample:**
```
$ docker compose ps
NAME         IMAGE              STATUS                   PORTS
app-cache-1  redis:7-alpine     Up 2 minutes             6379/tcp
app-db-1     postgres:16-alpine Up 2 minutes (healthy)   0.0.0.0:5433->5432/tcp
app-web-1    app-web            Up 1 minute              0.0.0.0:3000->3000/tcp
```

### Hands-on (30 min)
1. Create `init.sql`:
```sql
CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  body TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
INSERT INTO notes (body) VALUES ('seeded note');
```
2. Build the compose file above (adapt to your app; `web` can stay the simple Node server).
3. `docker compose up -d --build`
4. Verify the seed ran: `docker compose exec db psql -U postgres -d appdb -c "SELECT * FROM notes;"`
5. Insert a row manually, then `docker compose down` and `up` again — confirm it survived.
6. Now `docker compose down -v` and `up` — confirm it's back to just the seed row.
7. Connect your app to the DB and read the notes table. Getting the connection string right is the real exercise.

### QA → Dev bridge
This whole file is **your test environment as code**, with seeded fixtures (`init.sql`) and health gating. The `condition: service_healthy` pattern is the containerised version of a **readiness wait** in your test setup — you already know that "the service started" and "the service can answer" are different things, because flaky tests taught you.

### Mistakes
1. Port clashes with locally-installed Postgres/Redis. Map to 5433/6380 on the host side.
2. Forgetting `--build` after changing the Dockerfile. You run old code and lose 20 minutes.
3. Expecting `init.sql` to rerun on every `up`. It only runs when the **volume is empty**. Use `down -v` to force it.
4. Bind-mounting over `node_modules` without the anonymous-volume shield.
5. Hardcoding passwords in the compose file and committing it. Use a `.env` file (and `.gitignore` it).

---

# Day 11 — Compose for a Real Dev Workflow

**Time: ~70 min**

### Why this matters
Today you make Docker *pleasant* to develop in: hot reload, sane secrets, overrides for dev vs CI, and running your test suite in a container.

### Simple explanation
You want two modes from one setup: **dev mode** (code mounted live, debug logging, dev dependencies) and **CI mode** (self-contained image, nothing mounted). Compose handles this with **override files** — a base file plus a patch layered on top, like CSS overriding defaults.

### Diagram — override layering

```
  docker-compose.yml          docker-compose.override.yml
  (shared base)          +    (auto-loaded, dev-only)        =  what runs
 ┌──────────────────┐        ┌───────────────────────┐         ┌──────────────┐
 │ web:             │        │ web:                  │         │ web:         │
 │   build: .       │   +    │   volumes: ./src:/app │    =    │   build .    │
 │   ports: 3000    │        │   command: npm run dev│         │   ports 3000 │
 │   env: prod-ish  │        │   env: DEBUG=true     │         │   + mounts   │
 └──────────────────┘        └───────────────────────┘         │   + dev cmd  │
                                                                └──────────────┘

  For CI, skip the override explicitly:
  docker compose -f docker-compose.yml up        <- base only, no mounts
```

### Environment variables & `.env`
Compose automatically reads a `.env` file in the same folder:

**`.env`** (gitignored)
```
POSTGRES_PASSWORD=secret
APP_PORT=3000
```

**`docker-compose.yml`**
```yaml
services:
  web:
    ports:
      - "${APP_PORT}:3000"
  db:
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:?required}
```
> `${VAR:?message}` makes Compose fail loudly if the variable is missing — far better than starting with an empty password.

Commit a **`.env.example`** with dummy values so teammates know what to set.

### Hot reload
```yaml
# docker-compose.override.yml
services:
  web:
    command: npm run dev          # e.g. nodemon / vite / flask --reload
    volumes:
      - ./src:/app/src
      - /app/node_modules
    environment:
      NODE_ENV: development
      CHOKIDAR_USEPOLLING: "true"   # needed on some Mac/Windows setups
```

### Running tests in Compose
```bash
docker compose run --rm web npm test
```
`run` creates a **fresh one-off container** (unlike `exec`, which enters a running one). `--rm` cleans it up. This is exactly what CI will call on Day 12.

| | `docker compose exec` | `docker compose run` |
|---|---|---|
| Needs the service running | yes | no |
| Creates a new container | no | yes |
| Publishes ports | n/a | no (unless `--service-ports`) |
| Use for | poking at a live service | tests, migrations, one-offs |

### Commands
```bash
docker compose up -d                              # base + override (dev)
docker compose -f docker-compose.yml up -d        # base only (CI-like)
docker compose run --rm web npm test
docker compose run --rm web npm run migrate
docker compose --profile debug up                 # start optional services on demand
docker compose config                             # see the merged result — invaluable
docker compose watch                              # newer: auto-sync/rebuild on file change
docker compose top
```

**Profiles** — mark services that shouldn't start by default:
```yaml
  adminer:
    image: adminer
    ports: ["8081:8080"]
    profiles: ["debug"]
```
Now `docker compose up` skips it; `docker compose --profile debug up` includes it.

### Hands-on (25 min)
1. Split your Day 10 setup into `docker-compose.yml` (no bind mounts, production-ish command) and `docker-compose.override.yml` (bind mounts + dev command).
2. Run `docker compose config` and read the merged output. Then run `docker compose -f docker-compose.yml config` and diff them mentally.
3. Move the DB password to `.env`, add `.env` to `.gitignore`, create `.env.example`.
4. Add a trivial test (`npm test` running a script that exits 0) and run it with `docker compose run --rm web npm test`. Confirm the exit code: `echo $?`.
5. Add an `adminer` service behind a `debug` profile and start it on demand.

### QA → Dev bridge
Override files are **environment-specific config files** — the same idea as `config.qa.json` vs `config.staging.json`. You already know the pattern: one shared base, per-environment deltas.

`docker compose run --rm web npm test` returning a non-zero exit code is **the entire contract CI needs**. Your test suite's pass/fail becomes the pipeline's pass/fail with zero glue code.

### Mistakes
1. Committing `.env`. It's the classic credential leak.
2. Forgetting that `docker-compose.override.yml` is loaded **automatically** — then being confused when CI behaves differently. Be explicit with `-f` in CI.
3. Using `exec` in CI. The service isn't running yet. Use `run`.
4. Hot reload silently not working because the file watcher can't see changes across the mount — that's what `CHOKIDAR_USEPOLLING` / polling mode fixes.

---

# Day 12 — Docker in CI/CD

**Time: ~70 min**

### Why this matters
This is where your QA background becomes a genuine advantage. You already understand pipelines; now you'll understand why containerising them removes an entire class of flakiness.

### Simple explanation
Without Docker, CI is **a shared kitchen where everyone's ingredients get mixed up** — one job upgrades Node, another breaks. With Docker, every job **brings its own sealed kitchen**. And the image your tests passed against is the *exact same image* that gets deployed. No "but it worked in CI."

### Diagram — Docker in a pipeline

```
 DEVELOPER                CI SERVER                      REGISTRY        DEPLOY
 ┌────────┐   git push   ┌────────────────────────────┐              ┌──────────┐
 │ commit │ ───────────► │ 1. checkout code           │              │ staging  │
 │  code  │              │                            │              │          │
 └────────┘              │ 2. docker build            │              │  pull &  │
                         │      -t app:$SHA .         │              │   run    │
                         │         │                  │              │ app:$SHA │
                         │         ▼                  │              └────▲─────┘
                         │ 3. docker compose run      │                   │
                         │      --rm app npm test     │                   │
                         │         │                  │                   │
                         │    ┌────┴────┐             │                   │
                         │  PASS      FAIL ──► stop   │                   │
                         │    │                       │                   │
                         │    ▼                       │                   │
                         │ 4. docker push ────────────┼──► app:$SHA ──────┘
                         │      app:$SHA              │    app:latest
                         └────────────────────────────┘

  KEY IDEA: the SAME image artifact flows through test -> registry -> deploy.
            You never rebuild for production. Build once, promote everywhere.
```

### Tagging strategy that works

| Tag | Meaning | Use |
|---|---|---|
| `app:a3f9c21` (git SHA) | Exactly this commit | **Always produce this** — traceable and immutable |
| `app:1.4.2` | Semantic release | Tagged releases |
| `app:main` | Latest on main branch | Convenience for dev environments |
| `app:latest` | Default tag | Avoid in deploys; ambiguous |

### A GitHub Actions example
```yaml
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build image
        run: docker build -t app:${{ github.sha }} .

      - name: Run tests (with real DB via compose)
        run: docker compose -f docker-compose.yml -f docker-compose.ci.yml run --rm web npm test

      - name: Log in to registry
        if: github.ref == 'refs/heads/main'
        run: echo "${{ secrets.REGISTRY_TOKEN }}" | docker login ghcr.io -u ${{ github.actor }} --password-stdin

      - name: Push
        if: github.ref == 'refs/heads/main'
        run: |
          docker tag app:${{ github.sha }} ghcr.io/${{ github.repository }}:${{ github.sha }}
          docker push ghcr.io/${{ github.repository }}:${{ github.sha }}
```

Note `docker-compose.ci.yml` — no bind mounts, no dev command, so CI tests the **real built image**, not your local source.

### Commands
```bash
docker login ghcr.io -u USERNAME              # Authenticate to a registry
docker tag app:1.0 ghcr.io/org/app:1.0        # Retag for the target registry
docker push ghcr.io/org/app:1.0               # Upload
docker pull ghcr.io/org/app:1.0
docker logout

# Useful in CI
docker build --build-arg VERSION=$GIT_SHA -t app:$GIT_SHA .
docker compose -f base.yml -f ci.yml run --rm web npm test
docker compose -f base.yml -f ci.yml down -v   # always clean up in the job
docker save app:1.0 -o app.tar                 # Export an image to a file
docker load -i app.tar                         # Import it (useful for air-gapped CI)
```

### Hands-on (25 min)
Even without a CI server, simulate the pipeline locally with a script — this is the real learning:

**`ci-local.sh`**
```bash
#!/usr/bin/env bash
set -e     # stop on first failure, like a real pipeline

SHA=$(git rev-parse --short HEAD 2>/dev/null || echo "local")
echo "=== 1. BUILD ==="
docker build -t app:$SHA .

echo "=== 2. TEST ==="
docker compose -f docker-compose.yml run --rm web npm test

echo "=== 3. TAG ==="
docker tag app:$SHA app:latest

echo "=== 4. CLEANUP ==="
docker compose -f docker-compose.yml down -v

echo "Pipeline passed for $SHA"
```
```bash
chmod +x ci-local.sh && ./ci-local.sh
echo $?
```
Now make a test fail deliberately and rerun. Confirm the script stops at step 2 and exits non-zero. **That stop is the whole point of CI.**

Then, if you have a GitHub repo, add the workflow file above and watch it run.

### QA → Dev bridge
This is your home turf. Things that should click immediately:
- **Flaky environment failures** largely disappear — every run starts from an identical image.
- **"Which build is on staging?"** becomes trivially answerable: the image tag *is* the git SHA.
- **Test data setup** moves into the compose file and `init.sql`, versioned with the code.
- **Parallel test runs** stop interfering — each job gets its own isolated containers and volumes.

Your QA instincts about reproducibility are exactly the instincts good Docker practice demands. You're not learning a new value system, just a new tool for one you already have.

### Mistakes
1. Rebuilding the image at deploy time instead of promoting the tested one. You then deploy something that was never tested.
2. Using `:latest` in the deploy step. You have no idea what's running.
3. Leaving containers/volumes behind between CI jobs — the runner fills up and jobs start failing mysteriously.
4. Putting secrets in `docker build --build-arg`. They're visible in `docker history`. Use runtime env vars or BuildKit secrets.
5. Running the dev compose file in CI, so bind mounts hide the fact that your Dockerfile is broken.

---

# Day 13 — Debugging Docker

**Time: ~70 min**

### Why this matters
You will hit these. Having a systematic approach instead of googling error strings is what makes you the person others ask.

### Simple explanation
Almost every Docker problem falls into one of four buckets: **build failed**, **container won't stay up**, **can't reach it**, or **data's wrong/missing**. Identify the bucket first, then the fix is usually two commands away.

### Diagram — the debugging decision tree

```
                    Something's wrong
                           │
        ┌──────────────────┼──────────────────┬───────────────────┐
        ▼                  ▼                  ▼                   ▼
   BUILD FAILS      CONTAINER EXITS      CAN'T CONNECT        WRONG DATA
        │                  │                  │                   │
  Read the LAST       docker logs <c>    docker ps -> is it   Is there a
  successful step     ───────────────    actually running?    volume mounted?
  in the output       Look at exit code       │                    │
        │                  │             ┌────┴────┐          ┌────┴─────┐
  ┌─────┴─────┐      ┌─────┴──────┐     NO        YES        NO         YES
  │ Debug by  │      │ 0 = done   │      │         │          │          │
  │ building  │      │     normally│     │    Is -p set?   data dies  did you
  │ to that   │      │ 1 = app err │     └──►    │         on rm    mount over
  │ stage:    │      │125= docker  │        docker port <c>          something?
  │           │      │     flag err│            │                docker exec ls
  │ docker    │      │126= not     │      Is app bound to           to check
  │ build     │      │     exec'able│     0.0.0.0, not
  │ --target  │      │127= cmd not │      127.0.0.1?
  └───────────┘      │     found   │      ───────────────
                     │137= OOM kill│      docker exec <c> \
                     │143= SIGTERM │        netstat -tlnp
                     └─────────────┘
```

### The errors you will actually see

| Error message | What it means | Fix |
|---|---|---|
| `bind: address already in use` | Host port taken | `lsof -i :3000`, or use a different host port |
| `executable file not found in $PATH` | Your `CMD` binary doesn't exist in the image | Check it's installed; check `WORKDIR` |
| `no such file or directory` on `COPY` | Path is wrong, or excluded by `.dockerignore` | Paths are relative to build context |
| `connection refused` to another container | Used `localhost`, or wrong port, or not ready | Use service name; add healthcheck |
| `permission denied` writing to a mount | Container user ID != host file owner | Run as matching UID, or fix folder perms |
| Exit code `137` | Out of memory (OOM-killed) | Raise Docker Desktop's memory limit |
| `no space left on device` | Docker disk full | `docker system prune -a` |
| `COPY failed: forbidden path` | Copying from outside the build context | Move the file in, or change context |
| Code changes not appearing | You didn't rebuild, or a stale bind mount | `docker compose up --build` |

### Debugging a failing build
When a build dies at step 7 of 10, build an image from step 6 and go look:
```bash
# Name a stage, then target it
docker build --target builder -t debug-img .
docker run --rm -it debug-img sh
# Now you're standing exactly where the build was before it broke
```
For a plain Dockerfile, temporarily comment out everything after the failing line, build, and `run -it ... sh`.

### Debugging a container that won't start
```bash
docker logs <name>                                # 80% of the time, the answer is here
docker inspect -f '{{.State.ExitCode}}' <name>
docker inspect -f '{{.State.Error}}' <name>
docker run -it --entrypoint sh myimage            # Bypass CMD/ENTRYPOINT, look around
docker run -it myimage sh -c "ls -la /app && cat /app/package.json"
```
`--entrypoint sh` is the single most useful debugging flag in Docker. It says "ignore what this image is supposed to do, just give me a shell."

### Debugging networking
```bash
docker compose exec web sh
  # inside:
  nslookup db                     # Does the name resolve?
  nc -zv db 5432                  # Is the port open? (or: wget -qO- db:5432)
  env | grep DATABASE             # Is the connection string what you think?
docker compose exec db netstat -tlnp    # What is the DB actually listening on?
docker port web                          # What's published?
```
If `nslookup db` fails -> networking problem. If it resolves but `nc` fails -> the service isn't up or isn't listening on `0.0.0.0`. That one split diagnoses most cases.

### Debugging mounts
```bash
docker inspect -f '{{json .Mounts}}' <name> | python3 -m json.tool
docker compose exec web ls -la /app          # Is your code actually there?
docker compose exec web ls /app/node_modules # Did the mount nuke your deps?
```

### Hands-on (25 min) — break things on purpose
Do each of these, read the error, then fix it. This is the highest-value hour in the whole plan.

```bash
# 1. Command not found
docker run --rm alpine node -v
# -> exec: "node": executable file not found. Fix: use node:20-alpine

# 2. Port clash
docker run -d -p 3000:80 --name a nginx
docker run -d -p 3000:80 --name b nginx
# -> bind: address already in use. Fix: -p 3001:80
docker rm -f a b

# 3. Wrong bind address (the classic)
docker run -d -p 8000:8000 --name loop python:3.12-alpine \
  python -m http.server 8000 --bind 127.0.0.1
curl localhost:8000        # -> fails / empty reply
docker rm -f loop
docker run -d -p 8000:8000 --name ok python:3.12-alpine \
  python -m http.server 8000 --bind 0.0.0.0
curl localhost:8000        # -> works
docker rm -f ok

# 4. localhost between containers
docker network create dbg
docker run -d --name db --network dbg -e POSTGRES_PASSWORD=x postgres:16-alpine
docker run --rm --network dbg postgres:16-alpine \
  psql postgresql://postgres:x@localhost:5432/postgres -c "SELECT 1"   # FAILS
docker run --rm --network dbg postgres:16-alpine \
  psql postgresql://postgres:x@db:5432/postgres -c "SELECT 1"          # WORKS
docker rm -f db && docker network rm dbg

# 5. Inspect a broken image without running its CMD
docker run --rm -it --entrypoint sh nginx:alpine
  ls /usr/share/nginx/html
  exit
```

### QA → Dev bridge
You already have the most important skill here: **systematic reproduction and isolation**. Debugging Docker is defect triage. "Does it fail in a fresh container?" is "does it reproduce on a clean environment?" — the same question you ask every day.

`--entrypoint sh` is your **manual exploratory testing session** when the automated path is broken. `docker logs` is the **failure log**. Exit codes are **test result statuses**.

Also useful: keep a personal notes file of errors you hit and the fix. Same instinct as a defect knowledge base.

### Mistakes
1. Guessing instead of reading `docker logs` first.
2. Fixing inside the container with `exec` and never updating the Dockerfile.
3. Reaching for `--no-cache` on every failure. It's slow and rarely the actual problem.
4. Not checking whether the app binds to `0.0.0.0`. Check this *first* for any "can't connect" issue.
5. Assuming Docker is broken when it's your YAML indentation. Run `docker compose config`.

---

# Day 14 — Mini Project: "DevNotes"

**Time: 1.5–2 hours**

### What you're building
A small notes API with a web page, backed by Postgres, fully containerised. It's deliberately boring — the point is the Docker work, not the app.

**Requirements you must satisfy:**
- At least 2 services (web + database)
- A Dockerfile **you write yourself**
- `docker-compose.yml` orchestrating everything
- A named volume so notes survive `docker compose down`
- Service-to-service communication by name
- A healthcheck gating startup order
- A `.dockerignore` and a `.env`

### Diagram — the target architecture

```
  Browser ──► http://localhost:3000
                    │
  ═══════════════ HOST ══════════════════════════════════════════
                    │  -p 3000:3000
  ┌─────────────────▼─────── network: devnotes_default ──────────┐
  │                                                               │
  │   ┌────────────────────┐   postgres://    ┌────────────────┐ │
  │   │       web          │   db:5432        │       db       │ │
  │   │ ──────────────────  ├─────────────────►│ postgres:16    │ │
  │   │  Dockerfile (yours) │  waits for       │  -alpine       │ │
  │   │  GET  /  -> list    │  healthcheck     │                │ │
  │   │  POST /notes -> add │                  │  init.sql seeds│ │
  │   └────────────────────┘                   └───────┬────────┘ │
  │                                                     │          │
  │                                          ┌──────────▼───────┐ │
  │                                          │ volume: pgdata   │ │
  │                                          │ survives `down`  │ │
  └──────────────────────────────────────────┴──────────────────┴─┘
```

### Project structure
```
devnotes/
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .env
├── .env.example
├── init.sql
├── package.json
└── src/
    └── server.js
```

### Step-by-step

**Step 1 — App (20 min).** Minimal Express + `pg`:

`package.json`
```json
{
  "name": "devnotes",
  "version": "1.0.0",
  "main": "src/server.js",
  "scripts": { "start": "node src/server.js", "test": "node -e \"console.log('ok')\"" },
  "dependencies": { "express": "^4.19.2", "pg": "^8.12.0" }
}
```

`src/server.js`
```javascript
const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.get('/health', (_, res) => res.json({ ok: true }));

app.get('/', async (_, res) => {
  const { rows } = await pool.query('SELECT * FROM notes ORDER BY id DESC');
  res.send(`<h1>DevNotes</h1><ul>${rows.map(r => `<li>${r.body}</li>`).join('')}</ul>`);
});

app.post('/notes', async (req, res) => {
  const { rows } = await pool.query(
    'INSERT INTO notes (body) VALUES ($1) RETURNING *', [req.body.body]
  );
  res.status(201).json(rows[0]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`up on ${PORT}`));  // 0.0.0.0!
```

`init.sql`
```sql
CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
INSERT INTO notes (body) VALUES ('first note from init.sql');
```

**Step 2 — Write the Dockerfile yourself (20 min).** Don't copy Day 4's blindly. Requirements: `node:20-alpine` base, correct layer ordering for caching, non-root user, `EXPOSE 3000`, exec-form `CMD`. Check your work against the Day 5 rules.

**Step 3 — `.dockerignore` (2 min):**
```
node_modules
.git
.env
*.log
```

**Step 4 — `.env` + `.env.example` (5 min):**
```
POSTGRES_PASSWORD=devsecret
POSTGRES_DB=devnotes
APP_PORT=3000
```

**Step 5 — Compose file (25 min).** Write it yourself using Day 10 as reference. It needs: `build: .` for web, `postgres:16-alpine` for db, the `pgdata` named volume, `init.sql` bind-mounted read-only into `/docker-entrypoint-initdb.d/`, a `pg_isready` healthcheck, and `depends_on: db: condition: service_healthy`.

**Step 6 — Run and verify (20 min):**
```bash
docker compose up -d --build
docker compose ps                    # db should show (healthy)
curl localhost:3000
curl -X POST localhost:3000/notes -H "Content-Type: application/json" \
     -d '{"body":"I containerised an app"}'
curl localhost:3000                  # your note appears
```

**Step 7 — Prove persistence (10 min):**
```bash
docker compose down                  # containers gone
docker volume ls | grep pgdata       # volume still there
docker compose up -d
curl localhost:3000                  # your note survived

docker compose down -v               # now wipe the volume
docker compose up -d
curl localhost:3000                  # only the init.sql seed — back to square one
```

**Step 8 — Stretch goals (optional):**
- Add `docker-compose.override.yml` with a bind mount + nodemon for hot reload
- Add an `adminer` service behind a `debug` profile
- Write a `ci-local.sh` that builds, tests, and tears down
- Convert the Dockerfile to multi-stage and compare image sizes

### You've succeeded when
- `git clone` + `docker compose up -d` on a fresh machine gives a working app, with **zero** other setup steps
- You can explain every line of your Dockerfile and compose file
- You can explain exactly why `down` keeps data but `down -v` doesn't

### QA → Dev bridge
Look at what you just built: **a complete, reproducible, seeded, versioned environment that anyone can stand up in 30 seconds.** That's the thing you've wanted every time a test environment was broken or configured differently from someone else's. You can now create it. That capability is genuinely valuable on a dev team, and your QA background means you understand *why* it matters better than many developers do.

---

# Cheat Sheet — 20 Commands You'll Actually Use

```bash
# ── RUNNING ─────────────────────────────────────────────────────────
 1. docker run -d -p 8080:80 --name web nginx    # Run detached with port mapping
 2. docker run -it --rm alpine sh                # Throwaway interactive shell
 3. docker ps -a                                 # All containers, running or not
 4. docker stop web && docker rm web             # Stop then remove
 5. docker rm -f web                             # Force-remove a running container

# ── INSPECTING / DEBUGGING ──────────────────────────────────────────
 6. docker logs -f --tail 100 web                # Follow the last 100 log lines
 7. docker exec -it web sh                       # Shell into a running container
 8. docker run -it --entrypoint sh myimage       # Shell in, bypassing CMD — best debug flag
 9. docker inspect -f '{{.State.ExitCode}}' web  # Why did it die?
10. docker stats                                 # Live CPU/memory per container

# ── IMAGES ──────────────────────────────────────────────────────────
11. docker build -t myapp:1.0 .                  # Build from Dockerfile in current dir
12. docker images                                # List local images + sizes
13. docker history myapp:1.0                     # Find the layer making it fat
14. docker tag myapp:1.0 ghcr.io/org/myapp:1.0   # Retag for a registry
15. docker push ghcr.io/org/myapp:1.0            # Upload

# ── VOLUMES & CLEANUP ───────────────────────────────────────────────
16. docker volume ls                             # List volumes
17. docker system df                             # How much disk is Docker using?
18. docker system prune -a                       # Reclaim space (careful)

# ── COMPOSE (your daily drivers) ────────────────────────────────────
19. docker compose up -d --build                 # Build + start everything
20. docker compose down                          # Stop + remove (add -v to wipe volumes)

# ── HONOURABLE MENTIONS ─────────────────────────────────────────────
    docker compose logs -f web
    docker compose exec web sh
    docker compose run --rm web npm test
    docker compose config                        # Validate & see merged YAML
    docker cp web:/app/out.log ./
```

---

# 5 Mistakes Every Beginner Makes

### 1. Expecting data to survive `docker rm`
**What happens:** You configure a database, restart your setup, everything's gone.
**Why:** The container's writable layer is deleted with the container.
**Avoid it:** Any service that stores data gets a named volume. Say it out loud before you `run`: *"where does this write, and is that path mounted?"*

### 2. Using `localhost` to reach another container
**What happens:** `ECONNREFUSED 127.0.0.1:5432`, and you lose an hour.
**Why:** Inside a container, `localhost` is that container, not your host and not its neighbours.
**Avoid it:** Use the **service name** (`db:5432`). Use `host.docker.internal` to reach your laptop. And make your own app bind to `0.0.0.0`, never `127.0.0.1`.

### 3. `COPY . .` before installing dependencies
**What happens:** Every one-character code change triggers a 90-second dependency install. CI crawls.
**Why:** Changing any copied file invalidates the cache for every step after it.
**Avoid it:** Copy the manifest (`package.json`, `requirements.txt`, `go.mod`) -> install -> *then* copy source. Plus a `.dockerignore`.

### 4. Trusting `latest` and `depends_on`
**What happens:** A build that worked for months suddenly fails, or your app crashes on startup because the DB wasn't ready.
**Why:** `latest` is a moving target. `depends_on` waits for *started*, not *ready*.
**Avoid it:** Pin versions (`postgres:16.3-alpine`). Use `healthcheck` + `condition: service_healthy`, and make your app retry connections anyway.

### 5. Fixing things inside a running container
**What happens:** You `exec` in, install a missing package, everything works. Next rebuild, it's broken again — and your teammate can never reproduce your fix.
**Why:** Container changes are ephemeral and invisible to everyone else.
**Avoid it:** Every fix goes in the **Dockerfile** or **compose file**, then rebuild. Treat containers as disposable; treat the files as the truth.

**Bonus:** committing `.env`, baking secrets into images with `ENV`/`ARG` (visible in `docker history`), and never running `docker system prune` until your disk is full.

---

# "You're Ready When…" Checklist

### Mental model
- [ ] I can explain image vs container to a non-technical person in 30 seconds
- [ ] I know why a container exits immediately and how to keep one alive
- [ ] I can explain why containers start in a second but VMs take a minute
- [ ] I understand that layers are cached and read-only, and containers add one writable layer

### Daily use
- [ ] I can run any service from Docker Hub with the right ports and env vars, from memory
- [ ] I reach for `docker logs` before asking anyone for help
- [ ] I can shell into a container and poke around confidently
- [ ] I clean up regularly and know what `docker system prune` will delete

### Building
- [ ] I can write a Dockerfile for my app from scratch, no template
- [ ] I order instructions for cache efficiency without thinking about it
- [ ] I always add a `.dockerignore`
- [ ] I know when a multi-stage build is worth it, and can write one
- [ ] I can explain `RUN` vs `CMD` and `COPY` vs `ADD`

### Data & networking
- [ ] I choose volume vs bind mount correctly without looking it up
- [ ] My databases persist across `docker compose down`
- [ ] I connect services by name and know why `localhost` fails
- [ ] I bind my apps to `0.0.0.0` reflexively

### Compose
- [ ] I can write a multi-service compose file from scratch
- [ ] I use `.env` and never commit secrets
- [ ] I use healthchecks so startup order actually works
- [ ] I know the difference between `compose run` and `compose exec`
- [ ] I can set up hot reload for local development

### CI/CD & debugging
- [ ] I understand build once -> test -> push -> deploy the same image
- [ ] I tag images with the git SHA, not `latest`
- [ ] I can add a Docker build+test step to a pipeline
- [ ] When something breaks I diagnose systematically instead of googling the error string
- [ ] I know `--entrypoint sh` and use it

### The real test
- [ ] I can hand someone my repo and they get a working environment with `docker compose up`
- [ ] I could explain any of my Docker files in a code review and defend the choices
- [ ] When a teammate has a Docker problem, I'm useful

---

**Score yourself honestly.** If you can tick 80% of these after Day 14, you're at the level a dev team expects — and genuinely ahead of plenty of working developers who only ever copy-paste Dockerfiles.