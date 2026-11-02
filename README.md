# Deadlock Detection & Recovery Simulator (C, HTML, CSS)

A complete Operating Systems simulation suite built strictly with **ANSI C, HTML5, and CSS3** with **zero external libraries**.

---

## 📁 Project Structure

```
├── src/
│   ├── deadlock.c        # Core Operating System Engine in ANSI C
│   ├── style.css         # Pure CSS3 styling (no frameworks)
│   └── main.ts           # Standard DOM controller
├── index.html            # Pure HTML5 interface with SVG canvas
├── Makefile              # GCC build script
├── package.json          # Node server and scripts
├── vite.config.ts        # Server and API middleware
└── README.md             # Project documentation
```

---

## 🚀 How to Compile and Run the C Program

### Prerequisites
- GCC (`gcc`) or Clang
- Make (optional)

### Compilation via Makefile:
```bash
make
./deadlock_sim
```

### Manual Compilation with GCC:
```bash
gcc -O2 -Wall src/deadlock.c -o deadlock_sim
./deadlock_sim
```

### Command-Line Arguments:
- `./deadlock_sim`: Runs detection on the default 4-Way Circular Deadlock scenario.
- `./deadlock_sim --preset multi-instance-safe`: Runs detection on a multi-instance cycle that is safe.
- `./deadlock_sim --terminate 2`: Aborts process P2, returning all its allocated resources to available and re-evaluating safety.
- `./deadlock_sim --preempt 1 0 2`: Preempts 1 unit of resource R0 from process P1 and grants it to process P2.

---

## 🌐 How to Run the Web Application

```bash
npm install
npm run dev
```
Open your browser at `http://localhost:3000`.

---

## 🧠 Key OS Concepts Implemented

1. **Deadlock Detection**:
   - **Silberschatz / Galvin Multi-Resource Matrix Reduction Algorithm**:
     - Work Vector initialized to Available: $Work = Available$.
     - Finish array initialized ($Finish[i] = true$ if $Allocation[i] == 0$, else $false$).
     - Iteratively finds an active process $P_i$ where $Finish[i] == false$ and $Request_i \le Work$.
     - When satisfied, process completes: $Work = Work + Allocation_i$ and $Finish[i] = true$.
     - Any process remaining with $Finish[i] == false$ is confirmed **DEADLOCKED**.
   - **Wait-For Graph (WFG) Cycle Detection**:
     - Process-to-process blocking edges evaluated via Depth-First Search (DFS).

2. **Deadlock Recovery**:
   - **Process Termination**: Aborts victim processes one-by-one by minimum cost or lowest priority until the deadlock cycle is broken.
   - **Resource Preemption**: Preempts resource units and grants them to waiting requesters, with checkpoint rollback and starvation aging prevention.

3. **Coffman's 4 Necessary Conditions**:
   - Mutual Exclusion
   - Hold and Wait
   - No Preemption
   - Circular Wait
