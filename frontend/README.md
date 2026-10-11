# FreqGuard — Context-Aware Deepfake Detection Using Frequency Analysis

> **Frontend:** React 19 + Vite + JavaScript  
> **Styling:** Tailwind CSS v4  
> **Backend & Auth:** Firebase Authentication + Cloud Firestore + Firebase Storage  
> **Forensic Methodology:** 2D-FFT Spectral Analysis & Contextual Verification  

---

## 🚀 Quick Start

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies (already installed):
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser at `http://localhost:5173`.

---

## 📋 Features

- **Public Landing Page (`/`)**: Project introduction, 2D-FFT spectral simulation canvas, 5-stage workflow, and direct CTAs.
- **Authentication (`/login`, `/signup`)**: Email/Password and Google OAuth sign-in powered by Firebase Auth. Includes pre-filled demo mode for fast testing.
- **Protected User Dashboard (`/dashboard`)**: Forensic statistics, quick media uploader, recent analyses log, and safety tips.
- **Advanced Media Scanner (`/analyze`)**: Drag-and-drop image and video uploader with forensic filters, multi-stage radar scan animation, and presentation scenario overrides.
- **Forensic Verdict Screen (`/result/:analysisId`)**:
  - `REAL / AUTHENTIC` (celebration confetti + natural sensor decay confirmation)
  - `FAKE / MANIPULATION DETECTED` (high-frequency artifact spikes, azimuthal anomaly, and action guide)
  - `UNCERTAIN / INCONCLUSIVE` (forensic recommendations)
- **Incident Response & Action Center (`/guidelines`)**: 5-step mitigation protocol with direct official reporting links for Instagram, YouTube, X, Facebook, and WhatsApp.
- **Audit Trail (`/history`)**: Searchable, filterable analysis log with CSV export and JSON report download.
- **User Profile (`/profile`)**: Account credentials and password reset trigger.

---

## 🔌 Future ML Model Integration (Google Colab / FastAPI)

The frontend is completely decoupled from the model backend via `src/services/detectionService.js`.

When the Python backend is deployed:
1. Update `.env`:
   ```env
   VITE_API_BASE_URL=https://your-backend-api.com
   ```
2. The service automatically switches from mock simulations to calling `POST /api/detect` with the media `FormData`. No UI changes required.
