# Livestream Reaction Engine — Submission

## 1. Setup & Running Instructions

1. Extract the project ZIP file.
2. Open the project folder.
3. Open `index.html` using **Google Chrome**.
4. Ensure an internet connection is available to load the GSAP library.
5. Select a reaction using one of the reaction buttons.
6. Click **Send Reaction** to display the animation.
7. Use the **Animation Mode** selector to switch between Phase 1 (CSS) and Phase 2 (GSAP).
8. When using GSAP mode, adjust the **Animation Speed** slider to control the animation speed.

**Requirements:**
- Google Chrome browser.
- An internet connection to load the GSAP library through its CDN.

## 2. Phase 1: CSS Keyframes Analysis

**Paint Flashing Screenshot:**

![Phase 1 Paint Flashing](screenshots/01-phase1-css/phase1-paint-flashing.png)

**Performance Profile Screenshot:**

![Phase 1 Performance Profile](screenshots/01-phase1-css/phase1-performance-bottom-up.png)

**Performance Summary:**

![Phase 1 Performance Summary](screenshots/01-phase1-css/phase1-performance-summary.png)

**Observations:**

- **Paint Flashing:** During high-concurrency reaction spawning, green flashing appeared across almost half of the livestream stage. The green boxes closely followed the reactions' movement paths, forming a line as multiple reactions moved upwards. This indicates repeated repainting of areas affected by the animated reactions.

- **Main Thread Activity:** The Event Log showed repeated Layout, Recalculate Style, Pre-paint and Paint events while the CSS reactions were active. This indicates that the browser continued performing rendering-related work during the animation. Since the CSS keyframes animate layout-related properties such as bottom, margin-left and font-size, these animations can trigger additional layout and rendering calculations.

## 3. Phase 2: GSAP & Composited Rendering Analysis

**Performance Profile Screenshot:**

![Phase 2 GSAP Performance Profile](screenshots/02-phase2-gsap/phase2-gsap-performance-bottom-up.png)

**Performance Summary:**

![Phase 2 GSAP Performance Summary](screenshots/02-phase2-gsap/phase2-gsap-performance-summary.png)

**Observations:**

- **Flame Chart and Frame Rate:** In the captured GSAP snapshot, the Frame Rendering Stats overlay showed **60.0 FPS**. The Performance Summary covered **6.07 seconds** and reported **1,301 ms of Scripting**, **785 ms of Rendering**, **419 ms of System activity** and **250 ms of Painting**.

  In comparison, the Phase 1 CSS Performance Summary covered **5.36 seconds** and showed **56.4 FPS**, with **215 ms of Scripting**, **2,303 ms of Rendering**, **549 ms of System activity** and **305 ms of Painting**.

  Based on these captured profiles, GSAP achieved a higher displayed frame rate and lower Rendering and Painting activity compared to CSS keyframes. However, GSAP recorded higher Scripting activity because it uses JavaScript to control the animations. These results represent the specific profiling sessions and may vary between runs.

- **Paint Invalidation Areas:** During the GSAP test with 50 reactions, no noticeable green flashing was observed along the reactions' upward movement paths. However, when a second batch of 50 reactions was spawned consecutively, a row of green flashing areas appeared below the stage during spawning. This suggests that although GSAP's transform-based animations reduced repainting during movement, some painting activity still occurred when new reaction elements were created and added to the DOM.

## 4. Architectural Reflection

* **Runtime Control & Developer Experience:** CSS keyframes provide a straightforward way to define animations using predefined rules. However, making changes to an animation while it is running can be more difficult because the animation behaviour is mainly controlled through CSS. In comparison, GSAP provides greater programmatic control through timelines. In this project, GSAP allowed the playback speed of active reactions to be adjusted using the speed slider without restarting their animations. This makes it easier to manage and modify animation behaviour dynamically.

* **Pipeline Considerations:** If the application needed to dynamically tint, re-theme or modify reaction assets based on user preferences, programmatic vector manipulation would offer greater flexibility than using pre-rendered raster image sequences. Vector assets can be modified through code, allowing properties such as colour, shape and appearance to be changed at runtime. Raster image sequences consist of pre-rendered frames, so changing their appearance would require additional image processing or preparing alternative assets. Therefore, vector-based assets would be more suitable for applications that require frequent visual customisation.
