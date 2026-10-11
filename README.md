# Context-Aware Frequency Analysis for Deepfake Detection

A deep learning-based project that investigates **Context-Aware Frequency Analysis as a Preprocessing Stage for Deepfake Detection**. The project explores whether frequency-domain information can improve the identification of manipulated facial images when combined with an Xception-based classification model.

## Overview

Deepfakes are synthetic or manipulated media generated using artificial intelligence. Although manipulated images can appear visually realistic, they may contain subtle patterns and inconsistencies that are difficult to identify through visual inspection alone.

This project explores frequency analysis as an additional source of information for deepfake detection. It compares a baseline Xception model with an AFEM-enhanced approach to evaluate their performance on a curated face-image dataset.

The project also includes a React-based web interface intended to make media analysis and the presentation of detection results more accessible.

## Key Features

- **Deepfake classification:** Investigates real-versus-fake facial image classification.
- **Frequency-domain analysis:** Explores frequency information as a preprocessing stage.
- **AFEM-enhanced approach:** Evaluates the proposed AFEM approach alongside a baseline model.
- **Xception-based architecture:** Uses Xception as the image classification backbone.
- **Experimental evaluation:** Compares accuracy, precision, recall, F1-score, and ROC-AUC.
- **Web interface:** Provides a React and Vite frontend for interacting with the detection workflow.
- **Modular implementation:** Separates model code, application code, and frontend services.

## Research Objective

The main objective is to investigate whether incorporating context-aware frequency information before classification can improve the ability of a deep learning model to distinguish authentic facial images from manipulated ones.

The study compares two approaches:

1. **Baseline:** Xception-based classification without the proposed AFEM enhancement.
2. **AFEM-enhanced model:** Xception-based classification using the proposed frequency-analysis approach.

The objective is to evaluate not only classification accuracy but also the models' ability to distinguish between real and manipulated samples.

## System Architecture

The intended processing workflow is:

1. **Input:** Provide a facial image for analysis.
2. **Preprocessing:** Prepare the image for model inference.
3. **Frequency analysis:** Extract or incorporate frequency-domain information using the proposed AFEM approach.
4. **Feature extraction:** Process image information through the Xception-based model.
5. **Classification:** Generate a prediction for the input image.
6. **Result presentation:** Display the prediction and relevant analysis information through the application interface.

The exact processing path depends on the selected model and the implemented inference pipeline.

## Technologies Used

| Component | Technology |
|---|---|
| Frontend | React.js |
| Frontend tooling | Vite |
| Programming language | Python |
| Deep learning framework | PyTorch |
| Classification backbone | Xception |
| Frequency analysis | AFEM / frequency-domain processing |
| Backend direction | FastAPI |
| Version control | Git and GitHub |

*Note: FastAPI is the planned backend technology; its availability as a fully integrated inference service depends on the current implementation.*

## Experimental Results

The following results were obtained from the project's reported baseline and AFEM experiments.

| Evaluation Metric | Xception Baseline | AFEM-Enhanced |
|---|---:|---:|
| Accuracy | 84.38% | 85.00% |
| Precision | 79.89% | 82.18% |
| Recall | 91.87% | 89.38% |
| F1-score | 85.47% | 85.63% |
| ROC-AUC | 92.37% | 95.04% |

### Observations

- **Accuracy:** The AFEM-enhanced model improved accuracy from 84.38% to 85.00%.
- **Precision:** Precision increased from 79.89% to 82.18%.
- **Recall:** Recall decreased from 91.87% to 89.38%, indicating a trade-off between identifying fake samples and avoiding false-positive predictions.
- **F1-score:** The F1-score increased slightly from 85.47% to 85.63%.
- **ROC-AUC:** ROC-AUC increased from 92.37% to 95.04%, indicating improved ranking discrimination on the evaluated test set.

These results suggest that the AFEM-enhanced approach may improve discrimination performance in the evaluated setting. They do not, by themselves, establish generalization to unseen datasets or real-world media.

**Experimental setup:** The reported experiment used 2,000 face crops from FaceForensics++ under the c23 compression setting, comprising 1,000 real and 1,000 fake samples. A source-aware split was used with 1,400 training, 280 validation, and 320 test samples, with no overlap between source groups.

Results should be interpreted in the context of this dataset, split strategy, and experimental configuration.

## Project Structure

```text
Deepfake-Detection/
├── app/
│   └── main.py
├── src/
│   ├── afem_model.py
│   └── test_model.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   ├── package.json
│   └── package-lock.json
├── checkpoints/
│   └── (model weights stored locally)
├── datasets/
│   └── (dataset files stored locally)
├── .gitignore
└── README.md
```

The structure above summarizes the main project areas. The actual contents of the frontend and backend may evolve during development.

## Getting Started

### Prerequisites

Install the following before setting up the project:

- Python 3.11
- Node.js and npm
- Git
- A compatible model checkpoint for inference

### 1. Clone the repository

```bash
git clone https://github.com/Iffah-25/Deepfake-Detection.git
cd Deepfake-Detection
```

### 2. Set up the Python environment

Windows PowerShell:

```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
```

Install the Python dependencies required by the backend and model code. If the repository contains a `requirements.txt`, use:

```powershell
pip install -r requirements.txt
```

If no dependency file is present, install the dependencies specified by the project's Python imports and model implementation. Install a compatible PyTorch build for your hardware using the official PyTorch installation instructions.

### 3. Set up the frontend

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite in the terminal.

### 4. Run the backend

The backend entry point is located at `app/main.py`. Once the FastAPI application and its dependencies are configured, it can typically be started from the project root with:

```powershell
python -m uvicorn app.main:app --reload
```

This command assumes `app/main.py` exposes a FastAPI instance named `app` and that Uvicorn is installed.

### 5. Configure model weights

Model checkpoints are excluded from GitHub because of their size. Place the required checkpoint files in the locally configured checkpoint directory and ensure the model-loading code points to the correct paths.

The checkpoint filenames used during experimentation include:

- `xception_baseline_best.pth`
- `afem_v2_xception_best.pth`

These files are not included in the repository. You must obtain or generate them separately before running inference that depends on them.

## Dataset

The experiments use the FaceForensics++ dataset, a research dataset for manipulated facial media.

The reported experiment used the c23 compression setting and 2,000 face crops divided into training, validation, and testing subsets.

Access to the dataset may require accepting its terms and following the dataset provider's access instructions.

Dataset files and extracted image crops are not included in this repository.

## Limitations

- The reported results are based on a specific dataset and experimental split.
- Performance on unseen manipulation methods, compression levels, datasets, or real-world media has not been established by these results alone.
- The current experiments focus on facial image crops; full-video detection requires an appropriate frame extraction and aggregation pipeline.
- Model weights and datasets are not distributed with the source code.
- End-to-end functionality depends on completing the required backend, model-loading, and frontend integration.

## Future Improvements

- Evaluate on additional deepfake datasets and unseen manipulation techniques.
- Investigate cross-dataset generalization and robustness to image compression.
- Extend the pipeline to video-level detection.
- Improve model interpretability and provide useful visual analysis of frequency-domain features.
- Integrate model inference with the frontend through a documented API.
- Add automated testing, reproducible experiment configurations, and model version tracking.

## Research Contribution

This project investigates **context-aware frequency analysis as a preprocessing stage for deepfake detection**, using an Xception-based baseline and an AFEM-enhanced variant.

The reported experiments compare classification metrics and explore whether frequency-domain information can provide complementary cues for detecting manipulated facial images.

## Contributors

Add the names of the project team members and supervisor here.

- **Project:** Context-Aware Frequency Analysis as a Preprocessing Stage for Deepfake Detection
- **Degree:** Bachelor of Engineering
- **Department:** Computer Science and Engineering (AI & ML)
- **Academic Year:** 2024–2028

## License

No license has been specified yet. Add a `LICENSE` file before declaring the repository open source. Until then, do not assume that others have permission to reuse or redistribute the project.

## Acknowledgements

We acknowledge the researchers and maintainers of FaceForensics++ and the open-source communities behind PyTorch, React, Vite, and Xception-related research and implementations.
