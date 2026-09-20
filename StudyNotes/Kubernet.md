# Kubernetes for Developers — 14-Day Learning Plan

> **Big Picture:** Docker packages an app into a container and Compose runs a handful of those containers on **one machine**. Kubernetes takes that same idea and runs it across a **fleet of machines**, and then does something Docker never promised: it keeps watching. If a container dies, Kubernetes restarts it. If a machine dies, Kubernetes reschedules its work elsewhere. If you want more copies of your app, you change one number. You already know how to package an app — Kubernetes is the layer that keeps many copies of that package alive, reachable, and configured, across as many machines as you need, without you babysitting it. For most developers, day-to-day Kubernetes work is: write a handful of YAML files describing what you want running, apply them with `kubectl`, and read logs/describe output when something's wrong. That's the 20% this plan focuses on.

---

## Your 14-Day Map

| Days | Theme | You'll be able to... |
|---|---|---|
| 1–2 | Why Kubernetes + mental model | Explain K8s vs Docker/Compose, understand cluster architecture |
| 3–4 | Pods, ReplicaSets, Deployments | Deploy an app and keep N copies running |
| 5 | Services & exposing apps | Make pods reachable, understand service types |
| 6 | ConfigMaps & Secrets | Configure apps without baking config into images |
| 7 | Namespaces, labels, selectors | Organize and target resources correctly |
| 8 | Volumes & PersistentVolumes | Give a database durable storage |
| 9 | Ingress, probes, rolling updates | Route HTTP traffic, self-heal, deploy with zero downtime |
| 10 | kubectl debugging toolkit | Diagnose CrashLoopBackOff and friends fast |
| 11 | CI/CD + local clusters | Use kind/minikube, deploy from a pipeline |
| 12–13 | Mini project | Ship a 2-service app with storage, config, ingress |
| 14 | Review + where to go next | Cheat sheet, translation table, self-assessment |

---

### Day 1 — Why Kubernetes Exists (vs Docker & Compose)

**Time: ~50 minutes**

#### Why this matters for a developer
You already know Compose solves "run several containers together on my laptop." Kubernetes solves a different, bigger problem: "keep this app running correctly across many machines, survive failures, and let me scale it without manual work." If you don't understand *why* it exists, every YAML file you write later will feel like arbitrary ceremony.

#### Simple explanation (anchored to Docker)

- **Docker container** = one pet you name and personally care for. If it dies, you notice and restart it yourself.
- **Docker Compose** = you looking after a small group of pets on one property (your laptop or one server). Fine until the property runs out of room, or the property itself goes down.
- **Kubernetes Pod** = a managed, replaceable unit — more like livestock with an ear tag than a named pet. If one gets sick, it's replaced, not nursed back to health.
- **Kubernetes** = a management system spanning many properties (machines), constantly checking "is what I was promised actually running?" and fixing it when it isn't.

The core idea is **declarative, self-healing infrastructure**: you *declare* "I want 3 copies of this app always running," and Kubernetes continuously works to make that true — not just once, but forever, until you say otherwise.

> **New terms, one line each:**
> - **Cluster** — a group of machines (nodes) that Kubernetes manages as one unit.
> - **Node** — a single machine (virtual or physical) in the cluster that runs your containers.
> - **Control plane** — the "brain": the components that make decisions (what to run, where, and whether it's healthy).
> - **kubectl** — the CLI you use to talk to a cluster (`docker` → `kubectl`).
> - **Manifest** — a YAML file describing the desired state of something (a Deployment, a Service, etc).

#### Diagram — Compose vs Kubernetes

```text
        DOCKER COMPOSE                         KUBERNETES
     (one machine, manual)                (many machines, self-healing)

 ┌───────────────────────────┐        ┌──────────────────────────────────┐
 │        YOUR LAPTOP        │        │            CLUSTER                │
 │  ┌────────┐  ┌─────────┐  │        │  ┌───────────────┐                │
 │  │  web   │  │   db    │  │        │  │ CONTROL PLANE │  "the brain"   │
 │  └────────┘  └─────────┘  │        │  └───────┬───────┘                │
 │                            │        │          │ decides what runs where│
 │  If the laptop dies,       │        │  ┌───────┼────────┬───────────┐  │
 │  everything dies.          │        │  ▼       ▼        ▼           │  │
 │  If "web" crashes, YOU     │        │ NODE 1  NODE 2   NODE 3       │  │
 │  restart it (or --restart) │        │ [pod][pod] [pod]  [pod][pod]  │  │
 └───────────────────────────┘        │                                │  │
                                       │ A node dies? Pods reschedule   │  │
                                       │ elsewhere automatically.       │  │
                                       └────────────────────────────────┘
```

#### Diagram — cluster architecture (air traffic control analogy)

```text
   CONTROL PLANE  ≈  Air Traffic Control Tower
   ┌───────────────────────────────────────────────────┐
   │  API Server   — the tower's radio (all requests    │
   │                  go through here, including yours)  │
   │  Scheduler    — dispatcher: "send this plane (pod)  │
   │                  to that airport (node)"             │
   │  Controller   — watches: "are there really 3 planes  │
   │  Manager        in the air? If not, launch one."     │
   │  etcd         — the tower's logbook (stores all      │
   │                  cluster state; you never touch it)  │
   └───────────────────────────────────────────────────┘
                    │  instructions
     ┌──────────────┼───────────────┐
     ▼               ▼               ▼
  WORKER NODE     WORKER NODE     WORKER NODE      ≈ Airports
  (an airport)    (an airport)    (an airport)
  ┌──────────┐    ┌──────────┐    ┌──────────┐
  │ kubelet  │    │ kubelet  │    │ kubelet  │   ≈ ground crew that
  │ (runs &  │    │ (runs &  │    │ (runs &  │     actually starts/stops
  │  watches │    │  watches │    │  watches │     the planes here
  │  pods)   │    │  pods)   │    │  pods)   │
  │ [Pod]    │    │ [Pod]    │    │ [Pod]    │   ≈ planes, each carrying
  │ [Pod]    │    │          │    │ [Pod]    │     1+ containers (passengers)
  └──────────┘    └──────────┘    └──────────┘
```

You never SSH into a node and run `docker run` by hand. You tell the **API Server** what you want (via `kubectl apply`), and the control plane + kubelets make it happen.

#### kubectl commands to try

| Command | What it does | Rough output |
|---|---|---|
| `kubectl version --short` | Client & server version | `Client Version: v1.30.0` / `Server Version: v1.30.0` |
| `kubectl cluster-info` | Where the control plane lives | `Kubernetes control plane is running at https://127.0.0.1:...` |
| `kubectl get nodes` | List machines in the cluster | `NAME  STATUS  ROLES  AGE  VERSION` |
| `kubectl get all` | Everything in current namespace | Lists pods, services, deployments, etc. |
| `kubectl config current-context` | Which cluster you're talking to | `kind-kind` |

#### Hands-on activity (20 min) — install a local cluster
You need a local cluster before Day 2. Pick one:
- **kind** ("Kubernetes IN Docker") — lightweight, runs the whole cluster as Docker containers. Recommended if you're comfortable with Docker already.
- **minikube** — runs a single-node VM/container cluster with more built-in extras (dashboard, addons).

```bash
# Option A: kind (needs Docker running)
brew install kind          # or see kind.sigs.k8s.io for your OS
kind create cluster --name dev

# Option B: minikube
brew install minikube
minikube start

# Either way, confirm it worked:
kubectl get nodes
kubectl cluster-info
```

Expected output roughly:
```
$ kubectl get nodes
NAME                 STATUS   ROLES           AGE   VERSION
dev-control-plane    Ready    control-plane   45s   v1.30.0
```

#### QA → Dev bridge
Think about a **test grid** that auto-heals: if one Selenium node crashes mid-run, the grid detects it and spins up a replacement so your suite doesn't just hang. That auto-replacement instinct is exactly what Kubernetes does for your application, permanently, in production. You've experienced *wanting* this from the test side; now you're learning the tool that provides it for the app itself.

#### Common beginner mistakes
1. Thinking Kubernetes replaces Docker. It doesn't — it still uses container images (usually built with `docker build`); it just runs and manages them differently.
2. Trying to learn Kubernetes without a local cluster running. Get kind/minikube up before Day 2 — everything from here is hands-on.
3. Assuming you need Kubernetes for every project. (Day 11 has a flowchart — spoiler: most small projects don't.)

#### Day 1 done when you can
- [ ] Explain, in one sentence, what Kubernetes adds on top of what Docker already gives you
- [ ] Name the three worker-node components conceptually (kubelet runs pods; the node hosts them)
- [ ] Have a local cluster running and `kubectl get nodes` returning a Ready node

---

### Day 2 — Talking to the Cluster & Your First Pod

**Time: ~50 minutes**

#### Why this matters
Before writing YAML, you should see the smallest possible unit — a Pod — running and understand the request path from your terminal to a container.

#### Simple explanation
A **Pod** is the smallest thing you can deploy in Kubernetes. Most of the time a Pod wraps **one container** (though it can hold more that need to share storage/network tightly). The key mental shift from Docker: **you don't manage Pods directly day-to-day** — you manage a higher-level object (a Deployment, Day 3) that manages Pods for you. Today you create a bare Pod manually just to see how it behaves, the way you'd poke at `docker run` before learning Compose.

> **New terms:**
> - **Pod** — the smallest deployable unit; one or more containers that share network and storage, always scheduled together.
> - **kubectl apply -f** — "make the cluster match this YAML file" (declarative — like Compose's `up`, but continuously enforced).
> - **kubectl get / describe / logs** — your `docker ps` / `docker inspect` / `docker logs` equivalents.

#### Diagram — request path

```text
  YOU                     CONTROL PLANE                    WORKER NODE
┌────────┐   kubectl    ┌──────────────┐    schedules    ┌─────────────┐
│kubectl │ ───────────► │  API Server  │ ───────────────►│   kubelet   │
│ apply  │   (HTTPS)     │  (validates, │   "run this pod  │  (starts    │
│ -f pod │               │   stores in  │    here"         │  the        │
│  .yaml │               │   etcd)      │                  │  container) │
└────────┘               └──────┬───────┘                 └──────┬──────┘
                                 │                                 │
                          Scheduler picks                    container
                          which node                         runtime
                          (bin-packing                       (e.g.
                           decision)                       containerd)
                                                                  │
                                                                  ▼
                                                             ┌─────────┐
                                                             │  Pod    │
                                                             │[container]│
                                                             └─────────┘
```

#### YAML — your first Pod
```yaml
apiVersion: v1        # Which K8s API version this object belongs to
kind: Pod              # What kind of object this is
metadata:
  name: hello-pod       # Name shown in `kubectl get pods`
  labels:
    app: hello           # A tag used later for Services/selectors (Day 7)
spec:
  containers:
    - name: hello         # Container name inside the pod
      image: nginx:1.27-alpine   # Same image concept as `docker run nginx`
      ports:
        - containerPort: 80      # Documents the port; doesn't publish it (like EXPOSE)
```

#### kubectl commands to try

| Command | What it does | Rough output |
|---|---|---|
| `kubectl apply -f pod.yaml` | Create/update from a file | `pod/hello-pod created` |
| `kubectl get pods` | List pods | `NAME     READY  STATUS   RESTARTS  AGE` |
| `kubectl get pods -o wide` | ...with node & IP | adds `NODE`, `IP` columns |
| `kubectl describe pod hello-pod` | Full details + recent events | events log at the bottom — read this first when debugging |
| `kubectl logs hello-pod` | Container stdout/stderr | same as `docker logs` |
| `kubectl exec -it hello-pod -- sh` | Shell inside | same as `docker exec -it` |
| `kubectl port-forward hello-pod 8080:80` | Tunnel a local port into the pod | `Forwarding from 127.0.0.1:8080 -> 80` |
| `kubectl delete pod hello-pod` | Remove it | `pod "hello-pod" deleted` |

#### Hands-on (20 min)
```bash
# 1. Create the pod above, save as pod.yaml, then:
kubectl apply -f pod.yaml
kubectl get pods                 # watch STATUS go Pending -> ContainerCreating -> Running
kubectl describe pod hello-pod   # scroll to "Events" at the bottom

# 2. Reach it without a Service (temporary, dev-only trick)
kubectl port-forward pod/hello-pod 8080:80
curl http://localhost:8080       # in another terminal — nginx welcome page

# 3. Prove Kubernetes does NOT self-heal a bare Pod
kubectl delete pod hello-pod
kubectl get pods                 # gone. Nothing recreates it — that's Deployments' job (Day 3)
```

#### QA → Dev bridge
`kubectl describe` is your **incident report** — status, config, and a timeline of events, exactly like the detailed failure trace you'd pull from a CI job. `kubectl logs` and `kubectl exec` map directly onto `docker logs`/`docker exec`, so your existing debugging instincts transfer almost unchanged — only the CLI verb changes.

#### Mistakes
1. YAML indentation — Kubernetes YAML is unforgiving. Two spaces per level, never tabs. A misplaced `- ` under `containers:` is the single most common beginner error.
2. Expecting a bare Pod to restart itself if deleted. It won't — that's what Deployments (Day 3) are for.
3. Forgetting `-f` on `kubectl apply` and passing a directory when you meant a file (or vice versa).

---

### Day 3 — ReplicaSets & Deployments (Keeping Copies Alive)

**Time: ~60 minutes**

#### Why this matters
This is the object you'll actually use to ship your app. It's the Kubernetes equivalent of the `web:` block in your Compose file — except it also guarantees a number of running copies, forever.

#### Simple explanation
- **ReplicaSet** = the "always keep 3 planes in the air" guarantee. It watches the current count of matching Pods and creates/deletes Pods to match the desired number.
- **Deployment** = a manager *on top of* a ReplicaSet that also handles rolling out new versions safely (Day 9). In practice, **you almost never write a ReplicaSet directly — you write a Deployment**, and it creates and manages a ReplicaSet for you.

Compose equivalent: think of `docker-compose up -d --scale web=3`, except Kubernetes continuously re-enforces that "3" — if one dies, it's replaced within seconds, unprompted.

#### Diagram — hierarchy

```text
  Deployment "web"  (desired: 3 replicas, image: myapp:1.2)
        │
        │ creates & manages
        ▼
  ReplicaSet "web-7d9f8c6b5"     ← named after a hash of the pod template
        │
        │ ensures exactly 3 Pods matching its selector exist
        ▼
  ┌─────────┐   ┌─────────┐   ┌─────────┐
  │  Pod 1  │   │  Pod 2  │   │  Pod 3  │
  │ myapp   │   │ myapp   │   │ myapp   │
  └─────────┘   └─────────┘   └─────────┘

  If Pod 2 dies:
  ReplicaSet notices count = 2, desired = 3
        │
        ▼
  ┌─────────┐   ┌─────────┐   ┌─────────┐
  │  Pod 1  │   │ Pod 2'  │   │  Pod 3  │  ← new pod, same template,
  │ myapp   │   │ (new!)  │   │ myapp   │     different name/IP
  └─────────┘   └─────────┘   └─────────┘
```

#### YAML — a Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web                 # Deployment name
spec:
  replicas: 3                # "always keep 3 pods running"
  selector:
    matchLabels:
      app: web                 # Must match the Pod template's labels below
  template:                    # This is the Pod "recipe" the ReplicaSet stamps out
    metadata:
      labels:
        app: web                 # MUST match spec.selector.matchLabels exactly
    spec:
      containers:
        - name: web
          image: myapp:1.2         # Your built & pushed image
          ports:
            - containerPort: 3000
          resources:                # Optional but good practice: caps on usage
            requests:
              cpu: "100m"             # 0.1 CPU core requested
              memory: "128Mi"
            limits:
              cpu: "500m"
              memory: "256Mi"
```

> The `selector.matchLabels` ↔ `template.metadata.labels` match is the single most important — and most commonly broken — link in this file. If they don't match exactly, the Deployment can't find "its" pods.

#### kubectl commands to try

| Command | What it does | Rough output |
|---|---|---|
| `kubectl apply -f deployment.yaml` | Create/update | `deployment.apps/web created` |
| `kubectl get deployments` | List deployments | `NAME  READY  UP-TO-DATE  AVAILABLE  AGE` |
| `kubectl get replicasets` | List ReplicaSets | shows the auto-created RS |
| `kubectl get pods -l app=web` | Pods with that label | 3 pods listed |
| `kubectl scale deployment web --replicas=5` | Change replica count live | `deployment.apps/web scaled` |
| `kubectl delete pod <one-of-the-pod-names>` | Kill one pod manually | it's replaced within seconds |
| `kubectl rollout status deployment/web` | Watch a rollout finish | `deployment "web" successfully rolled out` |

#### Hands-on (25 min)
```bash
# 1. Apply the Deployment above (use nginx:1.27-alpine if you don't have your own image yet)
kubectl apply -f deployment.yaml
kubectl get pods -l app=web       # 3 pods, all Running

# 2. Prove self-healing
kubectl get pods -l app=web -o name    # copy one pod name
kubectl delete pod <paste-name-here>
kubectl get pods -l app=web -w         # watch — a replacement appears in seconds; Ctrl+C to stop

# 3. Scale live, no redeploy
kubectl scale deployment web --replicas=5
kubectl get pods -l app=web            # now 5

kubectl scale deployment web --replicas=2
kubectl get pods -l app=web            # down to 2 — extras terminated gracefully

# 4. Clean up
kubectl delete deployment web
```

#### QA → Dev bridge
This is your **"N healthy environments must always be up" SLA**, enforced automatically. If you've ever had a flaky test-runner pool where a dead node quietly reduced your parallelism until someone noticed, a Deployment is the fix: it doesn't just alert you that a copy died, it replaces it without anyone paging anyone.

#### Mistakes
1. **Selector/label mismatch.** `spec.selector.matchLabels` not matching `spec.template.metadata.labels` — the Deployment errors out or, worse, silently adopts pods it shouldn't. This is the #1 beginner YAML bug.
2. Deleting Pods and expecting the *count* to drop. It won't — a new one replaces it immediately, because the Deployment's job is enforcing the number, not obeying manual deletes.
3. Forgetting `resources.limits`. Without them, one runaway pod can starve everything else on a node.
4. Editing a running Pod directly with `kubectl edit pod`. Changes don't persist — edit the Deployment YAML and reapply.

---

### Day 4 — Understanding Rollouts, Pull Policy & Practical Deployment Habits

**Time: ~50 minutes**

#### Why this matters
Day 3 covered the "keep N running" mechanic. Today's the practical half: getting *your own* image running, understanding when Kubernetes re-pulls images, and reading rollout history — things you'll do on every real deploy.

#### Simple explanation
When you change a Deployment's Pod template (e.g., bump the image tag) and reapply, Kubernetes doesn't edit existing Pods — it creates a **new ReplicaSet** with the new template and gradually shifts Pods from old to new (full mechanics on Day 9). Today, focus on the **image** side: how Kubernetes decides whether to re-pull an image, and why `:latest` is even more dangerous here than in Compose, because a node may already have an old `:latest` cached and never re-check.

> **New terms:**
> - **imagePullPolicy** — controls when a node re-downloads an image: `IfNotPresent` (default for tags other than `latest`), `Always` (re-check every time), `Never` (only use what's local — useful for kind/local dev).
> - **Rollout history** — Kubernetes keeps previous ReplicaSets around so you can roll back.

#### Diagram — image pull decision

```text
        kubectl apply (new Pod spec, image: myapp:1.3)
                       │
                       ▼
        Does the node already have myapp:1.3 cached?
              │                          │
             YES                         NO
              │                          │
     imagePullPolicy?                 pull it
      │            │                  from the
  IfNotPresent   Always               registry
      │            │                       │
   use cached   re-pull anyway         (this is why CI must
   (fast)       (safest for            `docker push` before
                 :latest tags)          you deploy!)
```

#### YAML — image + rollback-friendly settings
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 3
  revisionHistoryLimit: 5      # how many old ReplicaSets to keep for rollback
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
        - name: web
          image: ghcr.io/yourorg/myapp:1.3.0   # pin a real tag, never :latest
          imagePullPolicy: IfNotPresent
```

#### kubectl commands to try

| Command | What it does | Rough output |
|---|---|---|
| `kubectl set image deployment/web web=myapp:1.4` | Update just the image, imperatively | `deployment.apps/web image updated` |
| `kubectl rollout status deployment/web` | Watch it finish | success message when done |
| `kubectl rollout history deployment/web` | List past revisions | `REVISION  CHANGE-CAUSE` |
| `kubectl rollout undo deployment/web` | Roll back to the previous revision | `deployment.apps/web rolled back` |
| `kubectl rollout undo deployment/web --to-revision=2` | Roll back to a specific one | same |
| `kubectl describe deployment web` | Full status + events | shows old/new ReplicaSet transition |

#### Hands-on (20 min)
```bash
kubectl apply -f deployment.yaml       # deploy 1.3.0 (use two nginx tags to simulate versions)
kubectl rollout status deployment/web

kubectl set image deployment/web web=nginx:1.28-alpine
kubectl rollout status deployment/web
kubectl rollout history deployment/web

kubectl rollout undo deployment/web    # back to the previous image
kubectl rollout status deployment/web
kubectl describe deployment web | grep Image     # confirm it reverted
```

#### QA → Dev bridge
`kubectl rollout undo` is your **automated rollback button** — the same safety net a blue-green or canary pipeline gives you in CI/CD, built into the platform instead of bolted onto your pipeline scripts. Rollout history is effectively a **build/version audit trail**, the same thing you'd check in a CI dashboard to answer "what was actually deployed, and when."

#### Mistakes
1. Using `:latest` in production manifests — combined with `imagePullPolicy: IfNotPresent`, a node can run a stale image indefinitely without erroring.
2. Forgetting to `docker push` before `kubectl apply` — the cluster can only pull images from a registry it can reach, not your laptop's local Docker cache (kind is a partial exception; see Day 11).
3. Assuming `rollout undo` also reverts non-image changes like ConfigMaps (Day 6) — it only reverts the Pod template captured in that ReplicaSet revision.

---

### Day 5 — Services: Making Pods Reliably Reachable

**Time: ~55 minutes**

#### Why this matters
Pods are disposable and get new IP addresses every time they're recreated. If your frontend hardcoded a backend Pod's IP, it'd break on every restart. A Service is the fix — and it's the single concept you'll use every time two things need to talk to each other in a cluster.

#### Simple explanation
A **Service** is a stable address — a name and IP that never changes — sitting in front of a shifting set of Pods. It's the airport's published phone number: planes (pods) come and go, get replaced, change tail numbers, but the phone number people call always connects to whichever plane is currently on duty.

In Compose, you got this **for free** — service names in `docker-compose.yml` were automatically resolvable. In Kubernetes, you get the same DNS-name convenience, but you must explicitly create the Service object; it isn't implied by the Deployment.

> **New terms:**
> - **Service** — a stable virtual IP + DNS name that load-balances traffic across matching Pods.
> - **Selector** — the label expression a Service uses to decide which Pods are "behind" it (same label mechanism as Deployments).
> - **Endpoints** — the live list of Pod IPs currently matching a Service's selector (auto-maintained).
> - **ClusterIP** — a Service reachable only inside the cluster (the default type).
> - **NodePort** — additionally exposes the Service on a fixed port on every node (simple way to reach it from outside during dev).
> - **LoadBalancer** — asks your cloud provider to provision an external load balancer (not meaningful on a local kind/minikube cluster without extra setup).

#### Diagram — Service → Endpoints → Pods

```text
   Another Pod (e.g. frontend) calls: http://web-service:80
                        │
                        ▼
        ┌───────────────────────────────┐
        │   Service "web-service"       │   stable DNS name + ClusterIP
        │   selector: app=web           │   never changes
        └───────────────┬────────────────┘
                         │ continuously watches for matching pods
                         ▼
        ┌───────────────────────────────┐
        │   Endpoints (auto-managed)    │   list of live Pod IPs
        │   10.1.0.5, 10.1.0.9, 10.1.0.7│
        └───────────────┬────────────────┘
             ┌───────────┼───────────┐
             ▼            ▼           ▼
         ┌───────┐   ┌───────┐   ┌───────┐
         │ Pod   │   │ Pod   │   │ Pod   │   app=web
         │10.1.0.5│  │10.1.0.9│  │10.1.0.7│
         └───────┘   └───────┘   └───────┘
   If a pod dies and is replaced with a new IP, Endpoints updates
   automatically. Callers never notice — they only ever used the Service name.
```

#### Diagram — Service types & traffic flow

```text
  ClusterIP (default)              NodePort                      LoadBalancer
  internal only                    internal + external via node  external via cloud LB

  ┌────────┐                      ┌────────┐                    ┌────────┐
  │ Pod A  │──► ClusterIP ──► Pod │Internet│──►node:30080──►Svc──│Internet│──►Cloud LB──►Svc──►Pod
  └────────┘    (in-cluster        └────────┘   (any node,       └────────┘   (real public
                 only)                            same port)                    IP — cloud only)
```

For local dev, you'll mostly use **ClusterIP** (service-to-service) and **NodePort** (reaching something from your browser).

#### YAML — a Service
```yaml
apiVersion: v1
kind: Service
metadata:
  name: web-service          # Other pods reach this app at http://web-service:80
spec:
  type: ClusterIP              # default; change to NodePort to reach from outside
  selector:
    app: web                   # Must match the Deployment's Pod labels — same rule as Day 3
  ports:
    - port: 80                  # Port the Service listens on
      targetPort: 3000           # Port the container actually listens on
```

For a NodePort version, add `type: NodePort` and optionally `nodePort: 30080` under the port entry.

#### kubectl commands to try

| Command | What it does | Rough output |
|---|---|---|
| `kubectl apply -f service.yaml` | Create the Service | `service/web-service created` |
| `kubectl get svc` | List Services | `NAME  TYPE  CLUSTER-IP  PORT(S)` |
| `kubectl get endpoints web-service` | See which Pod IPs it's routing to | `10.1.0.5:3000,10.1.0.7:3000` |
| `kubectl describe svc web-service` | Full details incl. selector | confirms selector matches pods |
| `kubectl run tmp --rm -it --image=busybox -- sh` | Throwaway pod to test connectivity from inside | drops you into a shell |
| `kubectl port-forward svc/web-service 8080:80` | Reach a ClusterIP Service from your laptop | `Forwarding from 127.0.0.1:8080 -> 80` |

#### Hands-on (25 min)
```bash
kubectl apply -f deployment.yaml     # from Day 3, 3 replicas
kubectl apply -f service.yaml

kubectl get svc web-service
kubectl get endpoints web-service    # should list 3 pod IPs

# Reach it from your laptop without NodePort
kubectl port-forward svc/web-service 8080:80
curl http://localhost:8080

# Prove DNS resolution from INSIDE the cluster
kubectl run tmp --rm -it --image=busybox --restart=Never -- sh
  wget -qO- http://web-service        # resolves by name, just like Compose service names
  exit

# Prove the selector link — break it on purpose
kubectl patch svc web-service -p '{"spec":{"selector":{"app":"wrong-label"}}}'
kubectl get endpoints web-service    # <none> — Service found zero matching pods
kubectl patch svc web-service -p '{"spec":{"selector":{"app":"web"}}}'   # fix it
kubectl get endpoints web-service    # populated again
```

#### QA → Dev bridge
A Service is exactly the **stable hostname pattern you rely on in a test environment's config** — you point your test suite at `api.staging.internal`, not at a specific machine's IP, precisely because the machine behind that name can change. Kubernetes gives every app that same stable-name guarantee automatically, and `kubectl get endpoints` is your **live health/routing table** — the same thing a load balancer's admin panel shows you in a traditional test/staging setup.

#### Mistakes
1. **Selector mismatch** (again — it's the theme of this whole system). `kubectl get endpoints` showing `<none>` is the single most common symptom; it always means the Service's selector doesn't match any Pod's labels.
2. Confusing `port` and `targetPort`. `port` is what callers use; `targetPort` is what the container actually listens on — they're often different numbers and mixing them up gives "connection refused."
3. Expecting `LoadBalancer` to work out of the box on kind/minikube. It typically stays `<pending>` without extra tooling; use NodePort or port-forward locally instead.
4. Forgetting the Service entirely and trying to reach Pods directly by IP — those IPs change every time a Pod is recreated.

---

### Day 6 — ConfigMaps & Secrets: Configuring Apps Properly

**Time: ~55 minutes**

#### Why this matters
You already know not to bake `DATABASE_URL` into a Docker image. Kubernetes gives you two first-class objects for external config: ConfigMaps for non-sensitive values, Secrets for sensitive ones. This is how you avoid rebuilding an image just to change a setting.

#### Simple explanation
- **ConfigMap** = your `.env` file, but stored in the cluster and injectable into any Pod.
- **Secret** = the same idea, but for sensitive values — base64-encoded at rest (not encrypted by default on a local cluster; treat it as "separated," not "secure," unless your cluster has encryption-at-rest configured — usually a platform-team concern, not yours).

Both can be injected as **environment variables** or **mounted as files** into a Pod. Env vars are simpler and match what you already do in Compose's `environment:`; file mounts matter when an app expects a config file on disk (e.g., an `nginx.conf`).

> **New terms:**
> - **ConfigMap** — a named bag of non-secret key/value config, decoupled from your image.
> - **Secret** — same shape, intended for sensitive data (passwords, API keys, tokens).
> - **envFrom** — inject an entire ConfigMap/Secret as environment variables in one line.

#### Diagram — injection into a Pod

```text
  ConfigMap "app-config"          Secret "db-secret"
  ┌───────────────────┐          ┌────────────────────┐
  │ LOG_LEVEL=debug    │          │ DB_PASSWORD=****    │
  │ FEATURE_X=on       │          │ API_KEY=****         │
  └─────────┬──────────┘          └──────────┬──────────┘
            │                                 │
            └───────────────┬─────────────────┘
                             ▼
                    ┌─────────────────┐
                    │   Pod: web      │
                    │  env vars:      │
                    │   LOG_LEVEL     │  ← from ConfigMap
                    │   FEATURE_X     │  ← from ConfigMap
                    │   DB_PASSWORD   │  ← from Secret
                    │   API_KEY       │  ← from Secret
                    └─────────────────┘
   Change the ConfigMap/Secret + restart the pods -> new values,
   no image rebuild required.
```

#### YAML — ConfigMap, Secret, and consuming them
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  LOG_LEVEL: "debug"       # plain text values
  FEATURE_X: "on"
---
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque                # generic key/value secret
stringData:                 # stringData lets you write plain text; K8s base64-encodes it for you
  DB_PASSWORD: "supersecret"
  API_KEY: "abc123"
```

```yaml
# Inside the Deployment's container spec:
      containers:
        - name: web
          image: myapp:1.3.0
          envFrom:
            - configMapRef:
                name: app-config     # every key becomes an env var
            - secretRef:
                name: db-secret        # every key becomes an env var
```

#### kubectl commands to try

| Command | What it does | Rough output |
|---|---|---|
| `kubectl apply -f config.yaml` | Create ConfigMap/Secret | `configmap/app-config created` |
| `kubectl get configmaps` | List ConfigMaps | `NAME  DATA  AGE` |
| `kubectl get secrets` | List Secrets | `NAME  TYPE  DATA  AGE` |
| `kubectl describe configmap app-config` | See keys (values shown) | key list with values |
| `kubectl describe secret db-secret` | See keys (values hidden) | key list, values redacted |
| `kubectl exec -it <pod> -- env` | Confirm env vars landed in the pod | full env var dump |
| `kubectl create secret generic db-secret --from-literal=DB_PASSWORD=abc` | Imperative alternative to YAML | `secret/db-secret created` |

#### Hands-on (25 min)
```bash
kubectl apply -f config.yaml           # ConfigMap + Secret
kubectl apply -f deployment.yaml       # with envFrom added

kubectl get pods -l app=web
kubectl exec -it <a-pod-name> -- env | grep -E "LOG_LEVEL|FEATURE_X|DB_PASSWORD"

# Change a ConfigMap value and see it does NOT auto-propagate
kubectl edit configmap app-config      # change LOG_LEVEL to "info", save & quit
kubectl exec -it <a-pod-name> -- env | grep LOG_LEVEL    # still "debug" — old value!

# Force pods to pick up the change
kubectl rollout restart deployment/web
kubectl exec -it <a-new-pod-name> -- env | grep LOG_LEVEL   # now "info"
```

#### QA → Dev bridge
This is the same discipline as **environment-specific config files per test stage** (`config.qa.json`, `config.staging.json`) — one codebase, swappable config. The gotcha you just proved by hand (ConfigMap changes don't auto-propagate to running Pods) is worth remembering the way you'd remember "the test runner caches config at startup" — you know to restart the process, not just edit the file.

#### Mistakes
1. Putting secrets in a ConfigMap "because it's easier." Anyone with read access to ConfigMaps can read it in plain text.
2. Assuming Secrets are encrypted by default. Base64 is encoding, not encryption — it's trivially reversible. Real secret security (encryption at rest, external secret managers) is usually a platform/DevOps concern; as a developer, just don't commit Secret YAML with real values to git.
3. Editing a ConfigMap and expecting running Pods to see the change immediately — they don't, until the Pod restarts (or you use a tool that watches for it, which is beyond this plan's scope).
4. Forgetting `stringData` vs `data` — `data` requires you to pre-base64-encode values yourself; `stringData` does it for you. Beginners often paste raw text into `data` and get garbage.

---

### Day 7 — Namespaces, Labels & Selectors: Organizing a Cluster

**Time: ~50 minutes**

#### Why this matters
So far everything's lived in one default space. Real clusters host multiple teams/environments, and everything you've learned (Services, Deployments) *depends on* labels working correctly. Today formalizes the labeling system you've been leaning on since Day 3.

#### Simple explanation
- **Namespace** = a folder that partitions a cluster into separate logical areas — like having `myapp-dev`, `myapp-staging`, and `myapp-prod` as separate Compose projects, but sharing the same physical cluster.
- **Labels** = arbitrary key/value tags you attach to objects (`app: web`, `env: staging`, `tier: backend`).
- **Selectors** = queries over labels, used by Services and Deployments to find "their" Pods (exactly what you've been writing since Day 3, just under its formal name).

Namespaces are about **isolation and organization**; labels/selectors are about **targeting**. They're independent but often used together (e.g., "all `tier: backend` pods in the `staging` namespace").

> **New terms:**
> - **Namespace** — an isolated scope for names; two objects can share a name if they're in different namespaces.
> - **Label** — a key/value tag on any object, used for grouping and selection.
> - **Annotation** — similar to a label but not used for selection — just metadata (tool config, descriptions). You won't write these often as a developer.

#### Diagram — namespaces as folders

```text
                         CLUSTER
   ┌─────────────────────────────────────────────────────┐
   │  namespace: dev          namespace: staging          │
   │  ┌───────────────────┐   ┌───────────────────┐       │
   │  │ Deployment: web    │   │ Deployment: web    │       │
   │  │ Service: web-svc   │   │ Service: web-svc   │       │
   │  │ ConfigMap: config  │   │ ConfigMap: config  │       │
   │  └───────────────────┘   └───────────────────┘       │
   │   same names, no collision — different namespaces     │
   │                                                        │
   │  namespace: kube-system   ← Kubernetes' own components│
   │  (you rarely touch this)                               │
   └─────────────────────────────────────────────────────┘

   web-service.dev talks to web-service in "dev" namespace by default;
   to cross namespaces, use: <service-name>.<namespace>.svc.cluster.local
```

#### YAML — namespace + labeled objects
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: myapp-staging
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
  namespace: myapp-staging      # this object now lives in that namespace
  labels:
    app: web
    tier: backend
    env: staging
spec:
  replicas: 2
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
        tier: backend
        env: staging
    spec:
      containers:
        - name: web
          image: myapp:1.3.0
```

#### kubectl commands to try

| Command | What it does | Rough output |
|---|---|---|
| `kubectl create namespace myapp-staging` | Create a namespace imperatively | `namespace/myapp-staging created` |
| `kubectl get namespaces` | List all namespaces | includes `default`, `kube-system`, yours |
| `kubectl get pods -n myapp-staging` | List pods in a specific namespace | scoped list |
| `kubectl get pods -A` | List pods across ALL namespaces | wide table with NAMESPACE column |
| `kubectl config set-context --current --namespace=myapp-staging` | Make a namespace your default | avoids typing `-n` every time |
| `kubectl get pods -l tier=backend` | Filter by label | pods with that label only |
| `kubectl get pods -l 'env in (staging,dev)'` | Filter by label set | pods matching either value |
| `kubectl label pod <name> debug=true` | Add a label on the fly | `pod/<name> labeled` |

#### Hands-on (20 min)
```bash
kubectl apply -f namespace.yaml
kubectl apply -f deployment.yaml -n myapp-staging

kubectl get pods -n myapp-staging
kubectl get pods -A | grep myapp-staging

# Switch your default namespace so you stop typing -n constantly
kubectl config set-context --current --namespace=myapp-staging
kubectl get pods              # now scoped automatically

# Practice label-based filtering
kubectl get pods -l app=web
kubectl get pods -l 'tier=backend,env=staging'

# Switch back
kubectl config set-context --current --namespace=default
```

#### QA → Dev bridge
Namespaces are the **dev / staging / prod separation** you already live in, except all three can technically run on the same physical cluster, isolated by name rather than by separate machines. Labels are exactly your **test tagging system** (`@smoke`, `@regression`, `@slow`) — a way to slice a large set of things into meaningful subsets for targeted commands, whether that's "run only smoke tests" or "restart only backend pods."

#### Mistakes
1. Forgetting `-n <namespace>` and wondering why `kubectl get pods` shows nothing — you're looking in `default`, but your stuff is elsewhere.
2. Two Deployments in the same namespace with the same labels but different `matchLabels` scope, causing one Deployment to accidentally manage the other's Pods. Keep label sets specific (`app: web-frontend`, not just `app: web`, once you have more than one app).
3. Deleting a namespace without realizing it deletes **everything inside it** — Deployments, Services, ConfigMaps, all of it, no confirmation prompt beyond the command itself.
4. Treating namespaces as a security boundary by default. They're an organizational boundary; real access control needs RBAC (out of scope here, usually a platform-team setup).

---

### Day 8 — Volumes & PersistentVolumes: Giving a Database Storage

**Time: ~60 minutes**

#### Why this matters
Pods are as ephemeral as containers — arguably more so, since they get replaced routinely (scaling, rollouts, node failures). A database Pod needs its data to survive all of that. This is Kubernetes' answer to Docker volumes.

#### Simple explanation
- A plain **Volume** in a Pod spec is like a Docker volume/bind mount scoped to that Pod — it survives container restarts *within* the same Pod, but not the Pod being deleted and recreated elsewhere.
- A **PersistentVolume (PV)** is a piece of real storage in the cluster (could be a cloud disk, or on kind/minikube, a local directory) — like a physical disk sitting in a storage closet.
- A **PersistentVolumeClaim (PVC)** is your Pod's request: "I need 5Gi of storage, please connect me to one." Kubernetes matches the claim to an available PV (or auto-provisions one via a StorageClass — think of that as "the closet automatically cuts a new disk to size instead of you finding an existing one").

You'll write PVCs constantly; PVs themselves are often handled by the platform/cloud (StorageClass auto-provisioning), similar to how you rarely think about the physical disk under a Docker named volume.

> **New terms:**
> - **PersistentVolume (PV)** — actual storage capacity available to the cluster.
> - **PersistentVolumeClaim (PVC)** — a Pod's request for some of that storage; this is what you write.
> - **StorageClass** — a template for auto-provisioning PVs on demand (so you rarely hand-create PVs yourself).

#### Diagram — PVC → PV → Pod

```text
   Pod "db"                    PersistentVolumeClaim "db-pvc"
 ┌─────────────┐              ┌─────────────────────────────┐
 │  container  │              │  "I need 5Gi, ReadWriteOnce" │
 │  mounts     │◄─────────────┤                               │
 │  /var/lib/  │  bound to    └───────────────┬───────────────┘
 │  postgresql │                              │ Kubernetes finds/creates
 └─────────────┘                              ▼ a matching PV
                              ┌─────────────────────────────┐
                              │  PersistentVolume (5Gi)      │
                              │  backed by real disk storage │
                              │  (cloud disk, or local path   │
                              │   on kind/minikube)            │
                              └─────────────────────────────┘

  Pod dies & is rescheduled → new Pod, SAME PVC → SAME data.
  This is the Kubernetes equivalent of Day-7-in-Docker's named volume.
```

#### YAML — PVC + a Pod (or StatefulSet-lite via Deployment) using it
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: db-pvc
spec:
  accessModes:
    - ReadWriteOnce      # one node can mount it read/write at a time — fine for a single DB pod
  resources:
    requests:
      storage: 1Gi          # how much space you're asking for
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: db
spec:
  replicas: 1                # IMPORTANT: keep at 1 for a PVC-backed single DB — see mistakes below
  selector:
    matchLabels:
      app: db
  template:
    metadata:
      labels:
        app: db
    spec:
      containers:
        - name: postgres
          image: postgres:16-alpine
          env:
            - name: POSTGRES_PASSWORD
              valueFrom:
                secretKeyRef:            # pulling ONE key out of a Secret (Day 6)
                  name: db-secret
                  key: DB_PASSWORD
          volumeMounts:
            - name: data
              mountPath: /var/lib/postgresql/data   # where Postgres writes
      volumes:
        - name: data
          persistentVolumeClaim:
            claimName: db-pvc              # links the volume to the PVC above
```

#### kubectl commands to try

| Command | What it does | Rough output |
|---|---|---|
| `kubectl apply -f pvc.yaml` | Create the claim | `persistentvolumeclaim/db-pvc created` |
| `kubectl get pvc` | Check binding status | `STATUS: Bound` (or `Pending` if nothing matches) |
| `kubectl get pv` | List actual storage volumes | shows the auto-provisioned PV |
| `kubectl describe pvc db-pvc` | Debug why it's stuck Pending | events show scheduling/provisioning issues |
| `kubectl exec -it <db-pod> -- psql -U postgres -c "\l"` | Confirm DB is up | lists databases |

#### Hands-on (25 min)
```bash
kubectl apply -f pvc.yaml
kubectl get pvc                     # should show Bound (kind/minikube auto-provision by default)

kubectl apply -f deployment.yaml    # the db Deployment above
kubectl exec -it <db-pod-name> -- psql -U postgres -c \
  "CREATE TABLE t(id int); INSERT INTO t VALUES (1);"

# Prove data survives a pod being killed and recreated
kubectl delete pod <db-pod-name>
kubectl get pods -l app=db -w       # wait for the replacement — Ctrl+C once Running
kubectl exec -it <new-db-pod-name> -- psql -U postgres -c "SELECT * FROM t;"   # -> 1, survived!
```

#### QA → Dev bridge
This is Day 7 of the Docker plan, restated at cluster scale: **the same instinct that "the database needs a real, persistent home separate from the disposable container" applies even harder here**, because Pods get rescheduled far more casually than Docker containers ever got restarted. The PVC is your **test data fixture that survives environment teardown**, just formalized as a cluster-level object.

#### Mistakes
1. **Scaling a PVC-backed Deployment above 1 replica** when using `ReadWriteOnce` storage. Multiple Pods can't all mount the same RWO volume simultaneously — you'll get scheduling errors. For a single database, keep `replicas: 1` (real production setups often use a dedicated `StatefulSet` for this — beyond this plan's scope, but know the term exists).
2. Forgetting the PVC entirely and only defining a plain `emptyDir` volume — that data is gone the moment the Pod is deleted, same as a Docker container's writable layer.
3. Assuming `kubectl delete pvc` is harmless. It can delete the underlying data depending on the reclaim policy — treat it like `docker volume rm`.
4. Not checking `kubectl describe pvc` when it's stuck `Pending` — usually means no StorageClass is available to satisfy the request (common on a bare-bones cluster setup, rare on kind/minikube which include a default one).

---

### Day 9 — Ingress, Health Checks & Rolling Updates

**Time: ~65 minutes**

#### Why this matters
Today covers three things that make an app production-credible: getting real HTTP traffic in from outside (Ingress), letting Kubernetes know when your app is actually healthy (probes), and deploying new versions with zero downtime (rolling updates) — all things a Compose setup leaves entirely to you.

#### Simple explanation

**Ingress** — a NodePort exposes one Service on one port. Real apps have multiple Services and want normal URLs (`/api`, `/app`) on standard ports 80/443. Ingress is an HTTP router sitting in front of your Services — like a reverse proxy (nginx, Traefik) you'd normally hand-configure yourself, but declared as YAML and managed by the cluster.

**Probes** — Kubernetes doesn't know if your app is "actually working," only if the process is running. Probes are the health checks you already write in test suites, but wired directly into the platform:
- **Liveness probe** — "is this pod alive, or should it be killed and restarted?" Fails repeatedly → Kubernetes restarts the container.
- **Readiness probe** — "is this pod ready to receive traffic right now?" Fails → the Service's Endpoints list stops routing to it (but it's *not* killed — it might just be warming up or temporarily busy).

**Rolling updates** — when you change a Deployment's image, Kubernetes doesn't stop all old Pods and start all new ones at once. It replaces them gradually, using readiness probes to confirm each new Pod is actually healthy before killing the next old one.

> **New terms:**
> - **Ingress** — an object describing HTTP routing rules (host/path → Service) into the cluster.
> - **Ingress controller** — the actual piece of software (e.g., nginx-ingress) that reads Ingress objects and does the routing; must be installed separately (kind/minikube have simple setup guides).
> - **Liveness probe** / **Readiness probe** — periodic health checks Kubernetes runs against your container.

#### Diagram — Ingress → Service → Pod

```text
   Browser: http://myapp.local/api
                    │
                    ▼
        ┌────────────────────────┐
        │   Ingress Controller    │   reads Ingress rules,
        │   (e.g. nginx-ingress)  │   acts as the entry point
        └────────────┬────────────┘
                      │  path "/api" -> service "api-service"
                      ▼
        ┌────────────────────────┐
        │  Service: api-service   │
        └────────────┬────────────┘
                      ▼
              ┌───────┴───────┐
              ▼               ▼
          ┌───────┐       ┌───────┐
          │ Pod   │       │ Pod   │   app=api
          └───────┘       └───────┘
```

#### Diagram — probe decision flow

```text
                 Kubernetes periodically checks each Pod
                          │
        ┌──────────────────┴──────────────────┐
        ▼                                      ▼
  READINESS PROBE                        LIVENESS PROBE
  "can it serve traffic                  "is it still alive
   right now?"                            and functioning?"
        │                                      │
   ┌────┴────┐                            ┌────┴────┐
  PASS      FAIL                         PASS      FAIL (repeatedly)
   │          │                            │          │
   ▼          ▼                            ▼          ▼
 stays in   removed from                stays      container
 Service's  Service's Endpoints          running    KILLED &
 Endpoints  (traffic stops,                          RESTARTED
 (gets      pod NOT killed —
 traffic)   might recover)
```

#### Diagram — rolling update (zero downtime)

```text
  Before:  [v1][v1][v1]                     3 old pods serving traffic

  Step 1:  [v1][v1][v1][v2 starting]         new pod created
                          │ wait for readiness probe to PASS
  Step 2:  [v1][v1][v2 ready]                one old pod terminated
                    ▲ traffic already shifting to v2 pods that are ready

  Step 3:  [v1][v2][v2 starting]             repeat...
  Step 4:  [v2][v2][v2]                      done — zero requests dropped,
                                              because old pods only die
                                              AFTER a replacement is ready
```

#### YAML — probes + Ingress
```yaml
# Inside the Deployment's container spec:
      containers:
        - name: web
          image: myapp:1.3.0
          ports:
            - containerPort: 3000
          readinessProbe:
            httpGet:
              path: /health         # your app must expose this
              port: 3000
            initialDelaySeconds: 3     # wait 3s after start before first check
            periodSeconds: 5             # check every 5s
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 10
            periodSeconds: 10
```

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myapp-ingress
spec:
  rules:
    - host: myapp.local             # add "127.0.0.1 myapp.local" to /etc/hosts for local testing
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: web-service    # your Day 5 Service
                port:
                  number: 80
```

#### kubectl commands to try

| Command | What it does | Rough output |
|---|---|---|
| `kubectl apply -f ingress.yaml` | Create the Ingress rule | `ingress.networking.k8s.io/myapp-ingress created` |
| `kubectl get ingress` | List Ingress objects + address | shows host and backend |
| `kubectl describe pod <name>` | See probe status/events | `Readiness probe failed: ...` if broken |
| `kubectl get pods -w` | Watch a rolling update live | STATUS transitions in real time |
| `kubectl rollout status deployment/web` | Wait for rollout completion | success once all new pods are ready |

#### Hands-on (25 min)
```bash
# 1. Add /health to your app (or use httpbin/nginx's default 200 root path to simulate)
# Apply the Deployment with probes added
kubectl apply -f deployment.yaml
kubectl describe pod <a-pod-name> | grep -A3 Readiness

# 2. Watch a rolling update happen live
kubectl set image deployment/web web=myapp:1.4.0 &
kubectl get pods -w         # watch old terminate only as new becomes Ready; Ctrl+C when done

# 3. (kind) enable an ingress controller — one-time setup, see kind docs for the exact manifest
# For minikube:
minikube addons enable ingress

kubectl apply -f ingress.yaml
kubectl get ingress
echo "127.0.0.1 myapp.local" | sudo tee -a /etc/hosts
curl http://myapp.local/
```

#### QA → Dev bridge
Readiness probes are, almost exactly, the **health-check endpoint you already build into services for smoke tests** — `/health` returning 200 before you consider an environment "up." Rolling updates are the automated version of a **blue-green deployment you've watched a release pipeline perform**: bring up the new version, confirm it's healthy, only then retire the old one — except here it happens per-Pod, automatically, on every single deploy, with no separate pipeline stage required.

#### Mistakes
1. Pointing a probe at a path that doesn't exist (`/health` returning 404) — Kubernetes will loop-restart a perfectly healthy app because it can't tell "unhealthy" from "wrong URL."
2. Setting `initialDelaySeconds` too low for a slow-starting app — it gets killed by the liveness probe before it's even finished booting. If your app is slow to start, raise the delay or add a `startupProbe` (an advanced variant; know it exists).
3. Confusing liveness and readiness. A failing readiness probe just pulls a Pod out of rotation (safe, recoverable); a failing liveness probe kills the container. Using liveness logic where readiness was meant can cause needless restart loops.
4. Forgetting an Ingress controller must be installed separately — an Ingress YAML with no controller running does nothing; `kubectl get ingress` will show no address.

---

### Day 10 — The kubectl Debugging Toolkit

**Time: ~55 minutes**

#### Why this matters
This is the day that turns "I have no idea why this pod is broken" into a five-minute diagnosis. It's your highest-leverage day for real-world usefulness.

#### Simple explanation
Almost every pod problem falls into a handful of buckets, and each has a signature symptom in `kubectl get pods`:

| STATUS you see | Usual meaning |
|---|---|
| `Pending` | Not scheduled yet — often a resource shortage or unbound PVC |
| `ImagePullBackOff` / `ErrImagePull` | Can't fetch the image — bad tag, private registry auth, typo |
| `CrashLoopBackOff` | Container starts and immediately exits, repeatedly — app-level error |
| `Running` but `0/1 Ready` | Container is up but failing its readiness probe |
| `OOMKilled` (seen in describe) | Container exceeded its memory limit |

#### Diagram — debugging decision tree

```text
                     kubectl get pods  →  something's not Running/Ready
                                │
        ┌────────────────────────┼────────────────────────┬─────────────────┐
        ▼                        ▼                        ▼                 ▼
    Pending             ImagePullBackOff          CrashLoopBackOff      Running,
        │                        │                        │             0/1 Ready
  kubectl describe        kubectl describe          kubectl logs             │
  pod <name>               pod <name>                <name>            kubectl describe
        │                        │              (--previous if it's      pod <name>
  look at Events:          look at Events:        already restarted)   → check readiness
  - insufficient CPU/mem   - wrong image name/tag       │                probe details
  - PVC not bound          - private registry,     Read the actual           │
  - node selector          missing imagePullSecret  app error — this    Is /health really
    can't be satisfied                              is almost always    returning 200?
                                                      an app bug, not    Test it directly:
                                                      a Kubernetes bug   kubectl exec -it
                                                                         <name> -- curl
                                                                         localhost:PORT/health
```

#### kubectl commands to try

| Command | What it does | When to use it |
|---|---|---|
| `kubectl get pods` | Quick status overview | Always your first command |
| `kubectl get pods -o wide` | ...plus node & IP | When you suspect a node-specific issue |
| `kubectl describe pod <name>` | Full config + Events timeline | **Second command, always** — the Events section explains most failures |
| `kubectl logs <name>` | Container's stdout/stderr | App-level errors (CrashLoopBackOff) |
| `kubectl logs <name> --previous` | Logs from the CRASHED instance | Crucial — `logs` alone shows the new, possibly-still-starting container |
| `kubectl logs <name> -c <container>` | Logs from one container in a multi-container pod | Multi-container pods |
| `kubectl exec -it <name> -- sh` | Shell inside a running container | Poking around, testing connectivity |
| `kubectl get events --sort-by=.lastTimestamp` | Cluster-wide recent events | Broader "what just happened" view |
| `kubectl top pod` | Live CPU/memory (needs metrics-server) | Suspected resource issues |
| `kubectl get pod <name> -o yaml` | The full live object definition | Comparing what's actually running vs your file |

#### Hands-on (25 min) — break things on purpose
```bash
# 1. ImagePullBackOff
kubectl run broken1 --image=myapp:this-tag-does-not-exist
kubectl get pods                       # STATUS: ErrImagePull / ImagePullBackOff
kubectl describe pod broken1 | tail -15    # Events explain exactly why
kubectl delete pod broken1

# 2. CrashLoopBackOff
kubectl run broken2 --image=busybox --restart=Never -- sh -c "exit 1"
kubectl get pods -w                    # watch it cycle through CrashLoopBackOff; Ctrl+C
kubectl logs broken2                   # may be empty/unhelpful once restarted
kubectl logs broken2 --previous        # the actual failed run's output
kubectl delete pod broken2

# 3. Pending pod (impossible resource request)
kubectl run broken3 --image=nginx --requests=cpu=999,memory=999Gi 2>/dev/null || \
  echo "(adjust: use a manifest with an absurd resources.requests to trigger Pending)"
kubectl describe pod broken3 | grep -A5 Events    # "Insufficient cpu" etc.
kubectl delete pod broken3

# 4. Readiness failure
# Apply a deployment whose readinessProbe points at a path that 404s, then:
kubectl get pods                       # Running, but 0/1 READY
kubectl describe pod <name> | grep -A3 Readiness
```

#### QA → Dev bridge
This entire day is **defect triage with a known taxonomy** — the same skill you use to sort a bug into "environment issue," "data issue," or "code issue" before you even start investigating. `kubectl describe`'s Events section is the **structured failure log** you wish every tool gave you; `--previous` logs are the **crash dump from the run that actually failed**, not the retry that's still booting. Once you've internalized the five STATUS values above, most "Kubernetes is broken" moments become five-minute lookups instead of hour-long mysteries.

#### Mistakes
1. Reading `kubectl logs` on a CrashLoopBackOff pod without `--previous` and seeing nothing useful — you're looking at the newest (possibly still-initializing) restart, not the one that actually failed.
2. Jumping to "Kubernetes is broken" for what is almost always an app-level bug (bad env var, unhandled exception on startup) surfaced *through* Kubernetes.
3. Not checking `kubectl describe` before anything else — the Events section usually names the problem outright ("Insufficient memory," "ImagePullBackOff: repository does not exist").
4. Forgetting that a Pending pod due to an unbound PVC (Day 8) looks identical to a resource-shortage Pending pod in `kubectl get pods` — you must `describe` to tell them apart.

---

### Day 11 — Kubernetes in CI/CD & Local Dev Clusters

**Time: ~60 minutes**

#### Why this matters
Today connects everything to your existing CI/CD instincts and gives you the "do I even need this?" reality check before the mini project.

#### Simple explanation
The CI/CD shape is nearly identical to what you built for Docker: **build an image → push it to a registry → tell the cluster to use the new image.** The new step is the last one — instead of `docker run` on a server, a pipeline runs `kubectl apply` (or `kubectl set image`) against a real cluster.

Locally, **kind** and **minikube** exist so you can practice all of this without a cloud bill or a real multi-node cluster. They are dev/test tools only — never confuse them with production infrastructure.

> **New terms:**
> - **kubeconfig** — a file (usually `~/.kube/config`) telling `kubectl` which cluster(s) to talk to and how to authenticate. Compare to a `.env` for your CLI itself.
> - **Context** — one named cluster+namespace+user combination inside a kubeconfig; `kubectl config use-context` switches between clusters (e.g., local vs staging).

#### Diagram — Kubernetes in a pipeline

```text
 DEVELOPER            CI SERVER                                 REGISTRY      CLUSTER
 ┌────────┐  push    ┌───────────────────────────────┐                    ┌──────────┐
 │ commit │ ───────► │ 1. docker build -t app:$SHA .  │                    │ staging  │
 └────────┘          │ 2. docker push app:$SHA ───────┼──► registry:$SHA   │  cluster │
                      │ 3. kubectl set image \         │                    │          │
                      │      deployment/web web=app:$SHA│                    │ pulls    │
                      │      --context=staging          │                    │ app:$SHA │
                      │ 4. kubectl rollout status \     │                    │ rolling  │
                      │      deployment/web             │                    │ update   │
                      │      (fails the build if the    │                    └──────────┘
                      │       rollout doesn't succeed)  │
                      └───────────────────────────────┘

  Same "build once, promote the same artifact" idea from Docker CI/CD —
  the deploy step just changed from `docker run` to `kubectl`.
```

#### Diagram — do I even need Kubernetes?

```text
                     Do I even need Kubernetes?
                              │
        ┌──────────────────────────────────────────┐
        │  Is this a small app / side project /     │
        │  single-service internal tool?             │
        └──────────────────┬───────────────────────┘
                  YES ──────┴────── NO
                   │                 │
                   ▼                 ▼
            NO — use Docker    Does it need to run across
            Compose or a       MULTIPLE machines, scale
            simple PaaS        elastically, or survive
            (Render, Fly.io,   individual machine failures
            Railway, a single  automatically?
            VM). Kubernetes             │
            adds ops overhead    YES ───┴─── NO
            you don't need.       │           │
                                   ▼           ▼
                          Does your team    Probably still
                          already run/      Compose + a
                          manage a cluster,  managed platform.
                          or do you need     Kubernetes' value
                          to because your    shows up at a scale
                          org standardized   most small/medium
                          on it?             projects never reach.
                                   │
                             YES ──┴── Learn it,
                                       it's justified.
```

**Be honest with yourself:** most small projects, side projects, and even many production apps at modest scale are genuinely better off on Compose + a simple host, or a managed PaaS. Kubernetes earns its complexity at a certain scale and organizational size — knowing when *not* to reach for it is itself the mark of a developer who understands the tool, not just uses it.

#### kubectl commands to try

| Command | What it does | Rough output |
|---|---|---|
| `kubectl config get-contexts` | List known clusters | shows kind/minikube + any others |
| `kubectl config use-context kind-dev` | Switch which cluster you're talking to | `Switched to context "kind-dev".` |
| `kubectl config current-context` | Confirm which one is active | `kind-dev` |
| `kind load docker-image myapp:1.0 --name dev` | Push a locally-built image straight into a kind cluster (skip a registry for local dev) | `Image: "myapp:1.0" with ID ... found to be already present` |
| `minikube image load myapp:1.0` | Same idea for minikube | loads image into minikube's runtime |

#### Hands-on (25 min)
```bash
# 1. Build an image and load it directly into your local cluster — no registry needed for local dev
docker build -t myapp:local .
kind load docker-image myapp:local --name dev        # or: minikube image load myapp:local

# 2. Deploy it, referencing the locally-loaded tag, with imagePullPolicy: Never
#    (so the node uses the loaded image instead of trying to pull from the internet)
kubectl apply -f deployment.yaml    # image: myapp:local, imagePullPolicy: Never
kubectl rollout status deployment/web

# 3. Simulate the CI deploy step locally
cat > ci-deploy.sh << 'EOF'
#!/usr/bin/env bash
set -e
SHA=$(git rev-parse --short HEAD 2>/dev/null || echo "local")
docker build -t myapp:$SHA .
kind load docker-image myapp:$SHA --name dev
kubectl set image deployment/web web=myapp:$SHA
kubectl rollout status deployment/web --timeout=60s
echo "Deployed myapp:$SHA"
EOF
chmod +x ci-deploy.sh && ./ci-deploy.sh
```

#### QA → Dev bridge
`kubectl rollout status ... --timeout=60s` **failing the build** if the rollout doesn't succeed is precisely the pass/fail gate you already trust from test-runner exit codes — a deploy that doesn't converge to healthy is a failed pipeline step, not a "deployed but who knows" situation. Multiple contexts (`kind-dev`, `staging`, `prod`) are your **environment switcher**, the same mental model as pointing a test suite at different base URLs, just for `kubectl` itself.

#### Mistakes
1. Running `kubectl apply` against the wrong context — always `kubectl config current-context` before anything destructive, especially once real staging/prod clusters exist.
2. Forgetting `imagePullPolicy: Never` (or `IfNotPresent`) when using `kind load` / `minikube image load` — without it, the node tries to pull from a real registry and fails, since the image only exists locally.
3. Treating a local kind/minikube cluster as representative of production networking/scale. It's great for learning and app-level testing, not a substitute for staging.
4. Not gating the pipeline on `kubectl rollout status` — without it, a broken deploy can silently "succeed" from CI's perspective while pods CrashLoop in the cluster.

---

### Day 12 — Mini Project, Part 1: Build & Configure "DevNotes on K8s"

**Time: 1.5 hours**

#### What you're building
The same DevNotes-style app from your Docker learning (a small notes API + Postgres), now deployed to your local Kubernetes cluster with proper config, secrets, and storage.

**Requirements this project satisfies:**
- 2 services: web API + Postgres database
- A Deployment + Service for each
- A ConfigMap and a Secret
- A PersistentVolumeClaim for the database
- Liveness and readiness probes
- Ingress (or NodePort as the simpler fallback)

#### Diagram — target architecture

```text
  Browser ──► http://devnotes.local  (or localhost:NodePort)
                       │
        ┌──────────────▼───────────────┐
        │      Ingress: devnotes         │
        └──────────────┬───────────────┘
                        ▼
        ┌───────────────────────────────┐
        │   Service: web-service         │  ClusterIP
        └──────────────┬─────────────────┘
                        ▼
        ┌───────────────────────────────┐
        │   Deployment: web (2 replicas) │
        │   readiness: GET /health        │
        │   liveness:  GET /health         │
        │   env from: app-config, db-secret│
        └──────────────┬─────────────────┘
                        │  postgres://db-service:5432
                        ▼
        ┌───────────────────────────────┐
        │   Service: db-service           │  ClusterIP
        └──────────────┬─────────────────┘
                        ▼
        ┌───────────────────────────────┐
        │   Deployment: db (1 replica)    │
        │   volumeMount ← PVC db-pvc       │
        └───────────────────────────────┘
```

#### Project structure
```text
devnotes-k8s/
├── namespace.yaml
├── configmap.yaml
├── secret.yaml
├── pvc.yaml
├── db-deployment.yaml
├── db-service.yaml
├── web-deployment.yaml
├── web-service.yaml
├── ingress.yaml
├── Dockerfile          (your app image, from the Docker plan's Day 4/5)
└── src/
    └── server.js
```

#### Step-by-step

**Step 1 — Reuse your app (10 min).** Use the DevNotes Express + `pg` app from the Docker plan, with a `/health` route that returns `200 { ok: true }` only once the DB pool can connect (a real readiness check, not just "the process is up").

**Step 2 — Namespace (5 min):**
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: devnotes
```

**Step 3 — ConfigMap + Secret (10 min).** Non-sensitive app settings in a ConfigMap, DB credentials in a Secret (use `stringData`, Day 6).

**Step 4 — PVC + db Deployment + db Service (20 min).** Combine Day 8's PVC pattern with a `db-service` (ClusterIP, port 5432) pointing at `app: db`.

**Step 5 — web Deployment with probes + envFrom (20 min).** Combine Day 6 (`envFrom`) and Day 9 (probes) into one Deployment — 2 replicas, image built from your Dockerfile, `DATABASE_URL` env var built from the Secret + `db-service` DNS name.

**Step 6 — web Service + Ingress (or NodePort) (10 min).** If your local cluster has an ingress controller set up, use Ingress; otherwise use `type: NodePort` on the web Service as the simpler path.

**Step 7 — Build and load the image, then apply everything (15 min):**
```bash
docker build -t devnotes:1.0 .
kind load docker-image devnotes:1.0 --name dev     # or: minikube image load devnotes:1.0

kubectl apply -f namespace.yaml
kubectl apply -f configmap.yaml -n devnotes
kubectl apply -f secret.yaml -n devnotes
kubectl apply -f pvc.yaml -n devnotes
kubectl apply -f db-deployment.yaml -n devnotes
kubectl apply -f db-service.yaml -n devnotes
kubectl apply -f web-deployment.yaml -n devnotes
kubectl apply -f web-service.yaml -n devnotes
kubectl apply -f ingress.yaml -n devnotes           # or skip if using NodePort

kubectl get all -n devnotes
```

#### QA → Dev bridge
You're assembling, piece by piece, exactly what you'd want from a **fully provisioned QA environment**: isolated namespace, seeded/persistent database, config separated from code, health checks gating traffic, and a stable entry point. The difference is you're now the one writing the provisioning spec, not waiting on someone else to hand you an environment.

---

### Day 13 — Mini Project, Part 2: Verify, Break, and Fix

**Time: 1–1.5 hours**

#### Step 8 — Verify it all works (20 min)
```bash
kubectl get pods -n devnotes                  # all Running, READY 1/1 or 2/2
kubectl get pvc -n devnotes                   # Bound
kubectl get svc -n devnotes                   # both services listed

# Reach it
kubectl port-forward -n devnotes svc/web-service 8080:80
curl http://localhost:8080/health
curl -X POST http://localhost:8080/notes -H "Content-Type: application/json" \
     -d '{"body":"deployed on kubernetes"}'
curl http://localhost:8080/
```

#### Step 9 — Prove persistence (10 min)
```bash
kubectl delete pod -n devnotes -l app=db
kubectl get pods -n devnotes -l app=db -w       # wait for replacement; Ctrl+C
kubectl port-forward -n devnotes svc/web-service 8080:80
curl http://localhost:8080/       # your note is still there — PVC did its job
```

#### Step 10 — Prove self-healing and zero-downtime updates (20 min)
```bash
# Self-healing
kubectl delete pod -n devnotes -l app=web --field-selector=status.phase=Running | head -1
kubectl get pods -n devnotes -l app=web -w      # replacement appears; Ctrl+C

# Rolling update
docker build -t devnotes:1.1 .
kind load docker-image devnotes:1.1 --name dev
kubectl set image deployment/web web=devnotes:1.1 -n devnotes
kubectl rollout status deployment/web -n devnotes
kubectl get pods -n devnotes -l app=web -w      # watch old->new transition; Ctrl+C
```

#### Step 11 — Break it on purpose and diagnose using Day 10's toolkit (20 min)
Pick two of these, break them, and fix them using only `kubectl describe`, `kubectl logs`, and `kubectl get events`:
1. Typo the image tag in `web-deployment.yaml` and reapply — diagnose the `ImagePullBackOff`.
2. Change the web Service's selector to a non-matching label — diagnose via `kubectl get endpoints`.
3. Point the readiness probe at a wrong path — diagnose the `0/1 Ready` state.
4. Remove the Secret before applying the web Deployment — diagnose the resulting Pod failure.

#### Step 12 — Stretch goals (optional)
- Add a second replica to the web Deployment and confirm the Service load-balances across both (check logs of each pod after several requests).
- Convert the NodePort Service to a real Ingress if you haven't already.
- Write the `ci-deploy.sh`-style script from Day 11 to build, load, and deploy this whole project in one command.
- Add `resources.requests`/`limits` to both Deployments if you skipped them.

#### You've succeeded when
- [ ] `kubectl apply -f .` (or your script) on a clean cluster brings up a fully working app with zero manual steps
- [ ] You can explain every field in every YAML file you wrote
- [ ] You can intentionally break each of the 4 failure modes above and diagnose them without looking anything up

#### QA → Dev bridge
Look at what you just proved: data survives pod death, the app self-heals from pod death, and you can deploy a new version with zero dropped requests — and you diagnosed four different failure classes using nothing but `kubectl describe` and `kubectl logs`. That combination — reproducible environments plus systematic failure diagnosis — is exactly the skill set your QA background already trained, now pointed at infrastructure instead of application behavior.

---

### Day 14 — Review, Cheat Sheet, and Where to Go Next

**Time: ~45 minutes**

Spend today reviewing, not learning anything new. Re-read your Day 12–13 YAML files cold and explain each field out loud. If you can't, revisit that day.

---

## Cheat Sheet — 20 kubectl Commands You'll Actually Use

| # | Command | What it does |
|---|---|---|
| 1 | `kubectl get pods` | List pods in current namespace |
| 2 | `kubectl get pods -A` | List pods across all namespaces |
| 3 | `kubectl get pods -o wide` | ...plus node and IP |
| 4 | `kubectl describe pod <name>` | Full detail + Events — your first debugging step |
| 5 | `kubectl logs <name>` | Container output |
| 6 | `kubectl logs <name> --previous` | Logs from a crashed/restarted container |
| 7 | `kubectl exec -it <name> -- sh` | Shell into a running container |
| 8 | `kubectl apply -f <file>` | Create/update from YAML |
| 9 | `kubectl delete -f <file>` | Remove what a YAML file defines |
| 10 | `kubectl get deployments` | List Deployments |
| 11 | `kubectl scale deployment <name> --replicas=N` | Change replica count live |
| 12 | `kubectl rollout status deployment/<name>` | Watch a rollout finish |
| 13 | `kubectl rollout undo deployment/<name>` | Roll back to the previous version |
| 14 | `kubectl set image deployment/<name> <container>=<image>` | Update just the image |
| 15 | `kubectl get svc` | List Services |
| 16 | `kubectl get endpoints <svc-name>` | See which pod IPs a Service is routing to |
| 17 | `kubectl port-forward svc/<name> 8080:80` | Reach a Service from your laptop |
| 18 | `kubectl get pvc` | Check persistent storage claim status |
| 19 | `kubectl config get-contexts` / `use-context` | List/switch clusters |
| 20 | `kubectl get events --sort-by=.lastTimestamp` | Recent cluster-wide events |

---

## Docker → Kubernetes Translation Table

| Docker / Compose concept | Kubernetes equivalent |
|---|---|
| `docker run` | `kubectl run` (ad hoc) or, properly, a **Deployment** |
| `docker-compose.yml` | Multiple YAML files: Deployment + Service (+ ConfigMap/Secret/PVC) per component |
| `docker ps` | `kubectl get pods` |
| `docker logs` | `kubectl logs` |
| `docker exec -it` | `kubectl exec -it` |
| `docker inspect` | `kubectl describe` / `kubectl get -o yaml` |
| `docker stop` / `docker rm` | `kubectl delete pod` (but it gets replaced if managed by a Deployment!) |
| `--restart=unless-stopped` | Deployment's replica guarantee (self-healing by default) |
| Compose service name (DNS) | Kubernetes Service name (DNS) |
| `-p host:container` | Service (ClusterIP/NodePort) + optionally Ingress |
| named volume | PersistentVolumeClaim + PersistentVolume |
| bind mount (dev live-reload) | Volume of type `hostPath` (local dev only — not for real clusters) |
| `.env` / `environment:` | ConfigMap (+ Secret for sensitive values) |
| `docker-compose up -d --scale web=3` | `kubectl scale deployment web --replicas=3` (but persistent, self-enforced) |
| `docker system prune` | `kubectl delete` unused objects manually (Kubernetes doesn't auto-prune) |
| Compose project (one machine) | Namespace (logical grouping, works across many machines) |
| `docker build` + local run | `docker build` + `docker push` + `kubectl apply`/`kubectl set image` |

---

## 5 Common Kubernetes Mistakes

| Mistake | Why it hurts | How to avoid |
|---|---|---|
| Label/selector mismatch between a Deployment's `selector` and its Pod template, or a Service's `selector` and Deployment's labels | The Deployment/Service can't find its Pods — Endpoints show `<none>`, or worse, it silently adopts the wrong Pods | Always copy the exact label set between `matchLabels`/`selector` and `template.metadata.labels`; verify with `kubectl get endpoints` |
| Treating a Pod as something you manage directly | Manual `kubectl delete pod` on an unmanaged Pod means it's just gone; on a managed one, a fresh (differently-named/IP'd) Pod appears — either way, confusing if you expected Docker-style persistence | Always deploy via Deployments, not bare Pods, except for quick one-off debugging |
| Ignoring `kubectl describe` and jumping straight to guessing | You miss the Events section, which names most failures outright | Make `describe` your automatic second command after `get pods` shows anything unhealthy |
| Setting a readiness/liveness probe path that doesn't match your app, or too aggressive timing | CrashLoopBackOff or pods stuck out of rotation even though the app is fine | Test the health endpoint manually first (`curl`), then set `initialDelaySeconds` generously and tighten later |
| Scaling a PVC-backed (ReadWriteOnce) Deployment above 1 replica | Pods fail to schedule because they can't all mount the same volume | Keep single-writer stateful workloads at `replicas: 1`, or use a proper StatefulSet pattern (beyond this plan's scope) |

---

## "You're Ready When…" Checklist

### Mental model
- [ ] I can explain, in one sentence, what Kubernetes adds beyond what Docker/Compose already give me
- [ ] I can describe the control plane vs worker node split without notes
- [ ] I understand why Pods are disposable and why I shouldn't manage them directly

### Core workloads
- [ ] I can write a Deployment YAML from scratch, no template
- [ ] I understand exactly why `selector` and `template.metadata.labels` must match
- [ ] I can explain readiness vs liveness probes and what happens when each fails
- [ ] I can watch and explain a rolling update as it happens

### Networking & config
- [ ] I can write a Service YAML and explain `port` vs `targetPort`
- [ ] I know when to use ClusterIP vs NodePort vs Ingress
- [ ] I can move config out of an image into a ConfigMap and a Secret
- [ ] I understand that ConfigMap/Secret changes need a pod restart to take effect

### Storage & organization
- [ ] I can explain PVC vs PV in my own words
- [ ] I know why a PVC-backed Deployment should usually stay at 1 replica
- [ ] I can use namespaces and labels to organize and target resources

### Debugging
- [ ] `kubectl describe` is my automatic second command after `get pods`
- [ ] I know to use `--previous` on `kubectl logs` for a crashed container
- [ ] I can diagnose ImagePullBackOff, CrashLoopBackOff, Pending, and readiness failures from their symptoms alone

### CI/CD & judgment
- [ ] I understand the build → push → deploy flow and how `kubectl` fits into it
- [ ] I can run a local cluster (kind or minikube) and load a locally-built image into it
- [ ] I can honestly assess whether a given project actually needs Kubernetes — and say "no" when the answer is no

### The real test
- [ ] I deployed a 2-service app with config, secrets, storage, probes, and networking, entirely from my own YAML
- [ ] I broke it on purpose four different ways and diagnosed each one using only `kubectl describe`/`logs`/`get events`
- [ ] I could walk a teammate through any of my manifests in a code review and defend every field

---

## Where to Go Next (deliberately not covered here)

These are real and useful, but belong to platform/DevOps/SRE work, not day-to-day developer work — learn them only if your role grows into that territory:
- **Helm** — a package manager for Kubernetes YAML (templating many manifests together)
- **Operators / CRDs** — extending Kubernetes with custom resource types and controllers
- **Service mesh** (Istio, Linkerd) — advanced traffic control, mTLS between services
- **StatefulSets** — the proper primitive for multi-replica stateful workloads (databases with replication, etc.)
- **RBAC** — fine-grained access control within a cluster
- **Cluster installation & etcd internals** — provisioning and operating the control plane itself
- **Advanced networking (CNI internals)** — how pod networking is actually implemented under the hood
- **Horizontal Pod Autoscaling (HPA)** — auto-scaling replica count based on CPU/memory/custom metrics (worth a quick look once you're comfortable with everything above — it's a small, high-value addition)

---

## How to Use This File

**Suggested file name:** `kubernetes-for-developers.md`

**Pacing:** This plan is written as 14 single days (45–90 minutes each), but it splits cleanly into a **2-days-per-day** pace for a one-week sprint if you have more time available — pair days like this: (1+2), (3+4), (5+6), (7+8), (9+10), (11), (12+13), (14). Don't compress Days 12–13 (the mini project) into less than the time given; that's where everything actually clicks together.

**Which local cluster tool to install first:** Start with **kind** if you're already comfortable with Docker — it runs the whole cluster as Docker containers, starts in seconds, and has the least conceptual overhead on top of what you know. Reach for **minikube** instead if you want a more batteries-included experience (built-in dashboard, one-command addons like `ingress` and `metrics-server`) or if kind gives you trouble with your OS/Docker setup. Either is completely fine for this entire plan — don't spend more than 10 minutes deciding.

**Tips for the hands-on activities:**
- Actually type the commands. Don't copy-paste blindly — typos in real Kubernetes YAML are where most of the learning happens (you WILL hit an indentation error; that's the point).
- Keep a scratch folder per day (`day03/`, `day05/`, etc.) so you can revisit and diff your YAML later.
- When a hands-on step says "break it on purpose," actually do it. Recognizing a failure signature on purpose, once, is worth more than reading about it five times.
- If you get stuck on a `describe` output you don't understand, read the **Events** section line by line before searching anywhere else — it usually already has your answer.
- Delete resources you're done with (`kubectl delete -f <file>`) between days to keep your local cluster's state easy to reason about; a cluster cluttered with old objects from three days ago makes `kubectl get pods` confusing.