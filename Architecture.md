# FORECAST SENTINEL
## System Architecture & Product Specification

> AI Forecast Reliability Engine for Medium-Range Weather Forecasts
>
> Smart India Hackathon 2026 — SIH26079

---

# 1. DOCUMENT PURPOSE

This document is the SINGLE SOURCE OF TRUTH for the Forecast Sentinel
application.

Any developer, AI coding agent, designer, or contributor working on this
project must read this document before implementing or modifying the system.

This document defines:

- What Forecast Sentinel is
- What problem it solves
- How the complete system works
- End-to-end data flow
- Frontend architecture
- Backend architecture
- ML architecture
- Verification architecture
- Mock/prototype architecture
- Real production architecture
- Database structure
- API structure
- UI screens
- Component structure
- Scientific logic
- Data rules
- Leakage prevention
- Evaluation methodology
- Demo behavior
- Future extensibility
- Features that must NOT be implemented as unnecessary complexity

The current SIH prototype is primarily a high-fidelity frontend prototype.

However, the architecture MUST be designed as if this will become a real
operational product.

The frontend mock layer must therefore be replaceable by a real FastAPI/ML
backend without redesigning the application.

---

# 2. PRODUCT DEFINITION

## Product Name

Forecast Sentinel

## Product Type

AI-powered forecast reliability and forecast-bust detection system.

## One-line definition

Forecast Sentinel predicts when an existing medium-range weather forecast is
likely to become unreliable before the actual weather outcome is known.

## Core statement

> We do not forecast the weather.
> We forecast whether the forecast can be trusted.

## What Forecast Sentinel IS

Forecast Sentinel is a reliability layer placed on top of an existing
medium-range weather forecasting system.

It analyzes:

- current forecast
- historical forecast errors
- forecast evolution
- ensemble spread
- weather/regime information
- recent error behavior
- model disagreement when available
- historical analogue situations

and produces:

- regional bust probability
- forecast confidence
- lead-time risk
- evidence behind the risk
- historical error context
- verification after the actual outcome
- model monitoring information

## What Forecast Sentinel IS NOT

It is NOT:

- a replacement weather forecasting model
- a general weather app
- a chatbot
- a generic AI dashboard
- a weather prediction website
- an LLM weather assistant
- a system claiming perfect forecast accuracy
- a system that guarantees forecast failure
- a system that blindly replaces ensemble spread

---

# 3. CORE PRODUCT QUESTION

The complete product exists to answer one operational question:

> "Which forecasts should a forecaster pay attention to because they are more
> likely to fail?"

The product answers:

## WHERE?

Which regions are at elevated risk?

## WHEN?

At which forecast lead time?

Day 1 → Day 10

## WHY?

What evidence is associated with the risk?

## HOW CERTAIN IS THE WARNING?

Is the predicted probability calibrated?

## DID WE GET IT RIGHT?

What happened after the actual weather became available?

---

# 4. HIGH-LEVEL SYSTEM FLOW

The complete system follows this pipeline:

```text
                    WEATHER FORECAST
                           |
                           v
                +----------------------+
                | Forecast Data        |
                | Ingestion            |
                +----------+-----------+
                           |
                           v
                +----------------------+
                | Data Validation       |
                | & Alignment          |
                +----------+-----------+
                           |
                           v
                +----------------------+
                | Forecast Verification|
                | Engine               |
                +----------+-----------+
                           |
                           v
                +----------------------+
                | Bust Label Generator |
                +----------+-----------+
                           |
                           v
                +----------------------+
                | Feature Engineering  |
                +----------+-----------+
                           |
          +----------------+----------------+
          |                |                |
          v                v                v
      Spread          Evolution         Historical
      Features        Features          Error
                                          |
          +----------------+----------------+
                           |
                           v
                +----------------------+
                | Reliability ML Model |
                +----------+-----------+
                           |
                           v
                +----------------------+
                | Probability          |
                | Calibration          |
                +----------+-----------+
                           |
                           v
                +----------------------+
                | Evidence Engine      |
                +----------+-----------+
                           |
                           v
                +----------------------+
                | Regional Risk Engine  |
                +----------+-----------+
                           |
                           v
                +----------------------+
                | FastAPI              |
                | Backend API           |
                +----------+-----------+
                           |
                           v
                +----------------------+
                | Forecast Sentinel     |
                | Frontend              |
                +----------+-----------+
                           |
                           v
                +----------------------+
                | Human Forecaster      |
                +----------+-----------+
                           |
                           v
                    ACTUAL WEATHER
                           |
                           v
                +----------------------+
                | Verification Engine  |
                +----------+-----------+
                           |
                           v
                +----------------------+
                | Monitoring / Learning|
                +----------------------+