import { useState, useMemo } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid,
  LineChart, Line, ReferenceLine, ReferenceDot
} from "recharts";

// ══════════════════════════════════════════════════════════════════════════════
// MATERIALS DATABASE — 25 materiales industriales
// ══════════════════════════════════════════════════════════════════════════════
const MATERIALS_DB = {
  "ASTM A53 Gr.B": {
    group: "Acero al Carbono", standard: "ASTM A53", grade: "Grade B", type: "CS - ERW/Seamless",
    composition: { C: "≤0.30%", Mn: "0.29–1.06%", P: "≤0.050%", S: "≤0.058%", Cu: "≤0.40%" },
    mechanical: { tensile_min: 415, yield_min: 240, elongation: 12, hardness_bhn: 137 },
    thermal: { max_temp_c: 425, min_temp_c: -29, conductivity: 50 },
    density: 7.85, modulus: 200, cost_factor: 1.0,
    weldability: "Buena", nelson_curve: "Carbon Steel", nace_mr0175: false,
    corrosion_resistance: { h2s: 2, hcl: 1, sulfuric: 2, naphthenic: 2, caustic: 3, steam: 3, crude: 3, amines: 2, hf: 1 },
    notes: "Tubería de uso general ERW/seamless. Baja presión y temperatura moderada. No aplica H2 severo.",
    color: "#f59e0b"
  },
  "ASTM A106 Gr.B": {
    group: "Acero al Carbono", standard: "ASTM A106", grade: "Grade B", type: "CS - Seamless",
    composition: { C: "≤0.30%", Mn: "0.29–1.06%", P: "≤0.035%", S: "≤0.035%", Si: "≥0.10%" },
    mechanical: { tensile_min: 415, yield_min: 240, elongation: 30, hardness_bhn: 143 },
    thermal: { max_temp_c: 510, min_temp_c: -29, conductivity: 50 },
    density: 7.85, modulus: 200, cost_factor: 1.15,
    weldability: "Muy Buena", nelson_curve: "Carbon Steel", nace_mr0175: false,
    corrosion_resistance: { h2s: 2, hcl: 1, sulfuric: 2, naphthenic: 2, caustic: 3, steam: 4, crude: 3, amines: 2, hf: 1 },
    notes: "Estándar de la industria para alta T/P en refinerías. Seamless = mayor calidad vs A53 en servicio severo.",
    color: "#3b82f6"
  },
  "ASTM A106 Gr.C": {
    group: "Acero al Carbono", standard: "ASTM A106", grade: "Grade C", type: "CS - Seamless (Alta Res.)",
    composition: { C: "≤0.35%", Mn: "0.29–1.06%", P: "≤0.035%", S: "≤0.035%", Si: "≥0.10%" },
    mechanical: { tensile_min: 485, yield_min: 275, elongation: 30, hardness_bhn: 156 },
    thermal: { max_temp_c: 510, min_temp_c: -29, conductivity: 50 },
    density: 7.85, modulus: 200, cost_factor: 1.25,
    weldability: "Buena", nelson_curve: "Carbon Steel", nace_mr0175: false,
    corrosion_resistance: { h2s: 2, hcl: 1, sulfuric: 2, naphthenic: 2, caustic: 3, steam: 4, crude: 3, amines: 2, hf: 1 },
    notes: "Mayor resistencia que Gr.B. Mayor precaución en soldadura por %C elevado.",
    color: "#60a5fa"
  },
  "ASTM A333 Gr.6": {
    group: "Acero al Carbono", standard: "ASTM A333", grade: "Grade 6", type: "CS - Seamless Baja Temp.",
    composition: { C: "≤0.30%", Mn: "0.29–1.06%", P: "≤0.025%", S: "≤0.025%" },
    mechanical: { tensile_min: 415, yield_min: 240, elongation: 35, hardness_bhn: 137 },
    thermal: { max_temp_c: 343, min_temp_c: -46, conductivity: 50 },
    density: 7.85, modulus: 200, cost_factor: 1.30,
    weldability: "Muy Buena", nelson_curve: "Carbon Steel", nace_mr0175: false,
    corrosion_resistance: { h2s: 2, hcl: 1, sulfuric: 2, naphthenic: 2, caustic: 3, steam: 3, crude: 3, amines: 2, hf: 1 },
    notes: "Servicio criogénico hasta -46°C. Impacto CVN garantizado. GLP y LNG.",
    color: "#93c5fd"
  },
  "API 5L Gr.X52": {
    group: "Acero al Carbono", standard: "API 5L", grade: "X52 PSL2", type: "CS - Tubería Conducción",
    composition: { C: "≤0.22%", Mn: "≤1.40%", P: "≤0.025%", S: "≤0.015%", Si: "≤0.45%" },
    mechanical: { tensile_min: 455, yield_min: 360, elongation: 23, hardness_bhn: 185 },
    thermal: { max_temp_c: 400, min_temp_c: -29, conductivity: 49 },
    density: 7.85, modulus: 200, cost_factor: 1.10,
    weldability: "Muy Buena", nelson_curve: "Carbon Steel", nace_mr0175: false,
    corrosion_resistance: { h2s: 2, hcl: 1, sulfuric: 2, naphthenic: 2, caustic: 3, steam: 3, crude: 4, amines: 2, hf: 1 },
    notes: "Líneas de transmisión y distribución. PSL2 con requisitos de tenacidad. Común en offsite.",
    color: "#fbbf24"
  },
  "API 5L Gr.X65": {
    group: "Acero al Carbono", standard: "API 5L", grade: "X65 PSL2", type: "CS - Tubería Conducción AR",
    composition: { C: "≤0.18%", Mn: "≤1.65%", P: "≤0.025%", S: "≤0.015%", Nb: "≤0.10%" },
    mechanical: { tensile_min: 531, yield_min: 448, elongation: 21, hardness_bhn: 220 },
    thermal: { max_temp_c: 400, min_temp_c: -29, conductivity: 49 },
    density: 7.85, modulus: 200, cost_factor: 1.35,
    weldability: "Buena", nelson_curve: "Carbon Steel", nace_mr0175: false,
    corrosion_resistance: { h2s: 2, hcl: 1, sulfuric: 2, naphthenic: 2, caustic: 3, steam: 3, crude: 4, amines: 2, hf: 1 },
    notes: "Alta resistencia para grandes diámetros. Microaleado Nb/V/Ti. Ductos de alta presión.",
    color: "#f97316"
  },
  "ASTM A335 P1": {
    group: "Acero Cr-Mo", standard: "ASTM A335", grade: "P1 (C-0.5Mo)", type: "Acero C-Mo Seamless",
    composition: { C: "0.10–0.20%", Mn: "0.30–0.80%", Mo: "0.44–0.65%", Si: "0.10–0.50%" },
    mechanical: { tensile_min: 380, yield_min: 205, elongation: 30, hardness_bhn: 143 },
    thermal: { max_temp_c: 510, min_temp_c: -29, conductivity: 48 },
    density: 7.83, modulus: 198, cost_factor: 1.6,
    weldability: "Buena (PWHT opcional)", nelson_curve: "C-0.5Mo", nace_mr0175: false,
    corrosion_resistance: { h2s: 2, hcl: 1, sulfuric: 2, naphthenic: 3, caustic: 3, steam: 4, crude: 3, amines: 2, hf: 1 },
    notes: "⚠️ ADVERTENCIA API 941: C-0.5Mo mostró fallas HTHA inesperadas. No recomendado para nuevos diseños.",
    color: "#fb923c"
  },
  "ASTM A335 P11": {
    group: "Acero Cr-Mo", standard: "ASTM A335", grade: "P11 (1.25Cr-0.5Mo)", type: "Acero Cr-Mo Seamless",
    composition: { C: "0.05–0.15%", Mn: "0.30–0.60%", Cr: "1.00–1.50%", Mo: "0.44–0.65%", Si: "0.50–1.00%" },
    mechanical: { tensile_min: 415, yield_min: 205, elongation: 30, hardness_bhn: 163 },
    thermal: { max_temp_c: 593, min_temp_c: -29, conductivity: 42 },
    density: 7.83, modulus: 195, cost_factor: 2.8,
    weldability: "Buena (PWHT req.)", nelson_curve: "1.25Cr-0.5Mo", nace_mr0175: true,
    corrosion_resistance: { h2s: 3, hcl: 2, sulfuric: 3, naphthenic: 4, caustic: 3, steam: 5, crude: 4, amines: 3, hf: 1 },
    notes: "Resistente a oxidación y fluencia. PWHT requerido. Nafténicos moderados. Buen balance costo/rendimiento.",
    color: "#8b5cf6"
  },
  "ASTM A335 P22": {
    group: "Acero Cr-Mo", standard: "ASTM A335", grade: "P22 (2.25Cr-1Mo)", type: "Acero Cr-Mo Seamless",
    composition: { C: "0.05–0.15%", Mn: "0.30–0.60%", Cr: "1.90–2.60%", Mo: "0.87–1.13%", Si: "≤0.50%" },
    mechanical: { tensile_min: 415, yield_min: 205, elongation: 30, hardness_bhn: 163 },
    thermal: { max_temp_c: 649, min_temp_c: -29, conductivity: 38 },
    density: 7.82, modulus: 192, cost_factor: 3.5,
    weldability: "Moderada (PWHT req.)", nelson_curve: "2.25Cr-1Mo", nace_mr0175: true,
    corrosion_resistance: { h2s: 4, hcl: 2, sulfuric: 3, naphthenic: 5, caustic: 3, steam: 5, crude: 5, amines: 3, hf: 1 },
    notes: "Estándar unidades de vacío y nafténicos altos (TAN>1.5). Excelente resistencia HTHA.",
    color: "#ec4899"
  },
  "ASTM A335 P5": {
    group: "Acero Cr-Mo", standard: "ASTM A335", grade: "P5 (5Cr-0.5Mo)", type: "Acero Cr-Mo Seamless",
    composition: { C: "≤0.15%", Mn: "0.30–0.60%", Cr: "4.00–6.00%", Mo: "0.44–0.65%", Si: "≤0.50%" },
    mechanical: { tensile_min: 415, yield_min: 205, elongation: 30, hardness_bhn: 179 },
    thermal: { max_temp_c: 649, min_temp_c: -29, conductivity: 35 },
    density: 7.80, modulus: 190, cost_factor: 4.2,
    weldability: "Moderada (PWHT req.)", nelson_curve: "5Cr-0.5Mo", nace_mr0175: true,
    corrosion_resistance: { h2s: 5, hcl: 3, sulfuric: 4, naphthenic: 5, caustic: 3, steam: 5, crude: 5, amines: 4, hf: 1 },
    notes: "Excelente resistencia H₂S (NACE MR0175). Alta resistencia a nafténicos. Hidrotratamiento y reformación.",
    color: "#f97316"
  },
  "ASTM A335 P9": {
    group: "Acero Cr-Mo", standard: "ASTM A335", grade: "P9 (9Cr-1Mo)", type: "Acero Cr-Mo Seamless",
    composition: { C: "≤0.15%", Mn: "0.30–0.60%", Cr: "8.00–10.00%", Mo: "0.90–1.10%", Si: "0.25–1.00%" },
    mechanical: { tensile_min: 415, yield_min: 205, elongation: 30, hardness_bhn: 179 },
    thermal: { max_temp_c: 704, min_temp_c: -29, conductivity: 32 },
    density: 7.78, modulus: 188, cost_factor: 5.0,
    weldability: "Difícil (PWHT req.)", nelson_curve: "9Cr-1Mo", nace_mr0175: true,
    corrosion_resistance: { h2s: 5, hcl: 3, sulfuric: 4, naphthenic: 5, caustic: 3, steam: 5, crude: 5, amines: 4, hf: 2 },
    notes: "Alta resistencia a temperatura y oxidación. Buena resistencia HTHA. Reactores alta temperatura.",
    color: "#e879f9"
  },
  "ASTM A335 P91": {
    group: "Acero Cr-Mo Mod.", standard: "ASTM A335", grade: "P91 (9Cr-1Mo-V)", type: "Acero Cr-Mo-V Seamless",
    composition: { C: "0.08–0.12%", Mn: "0.30–0.60%", Cr: "8.00–9.50%", Mo: "0.85–1.05%", V: "0.18–0.25%", Nb: "0.06–0.10%", N: "0.030–0.070%" },
    mechanical: { tensile_min: 585, yield_min: 415, elongation: 20, hardness_bhn: 250 },
    thermal: { max_temp_c: 649, min_temp_c: -29, conductivity: 29 },
    density: 7.75, modulus: 210, cost_factor: 7.5,
    weldability: "Muy Difícil (PWHT crítico)", nelson_curve: "9Cr-1Mo", nace_mr0175: true,
    corrosion_resistance: { h2s: 5, hcl: 3, sulfuric: 4, naphthenic: 5, caustic: 3, steam: 5, crude: 5, amines: 4, hf: 2 },
    notes: "Alta resistencia creep >600°C. PWHT estrictamente controlado. Riesgo envejecimiento Tipo IV.",
    color: "#a855f7"
  },
  "ASTM A312 TP304L": {
    group: "Inoxidable Austenítico", standard: "ASTM A312", grade: "TP304L", type: "AISI 304L Austenitic SS",
    composition: { C: "≤0.030%", Cr: "18–20%", Ni: "8–12%", Mn: "≤2%", Si: "≤0.75%" },
    mechanical: { tensile_min: 485, yield_min: 170, elongation: 35, hardness_bhn: 217 },
    thermal: { max_temp_c: 816, min_temp_c: -196, conductivity: 16 },
    density: 7.94, modulus: 193, cost_factor: 5.8,
    weldability: "Excelente", nelson_curve: null, nace_mr0175: false,
    corrosion_resistance: { h2s: 3, hcl: 2, sulfuric: 4, naphthenic: 4, caustic: 4, steam: 5, crude: 4, amines: 5, hf: 1 },
    notes: "Versátil. Sin Mo: menor resistencia a cloruros. Riesgo SCC en cloruros >60°C.",
    color: "#06b6d4"
  },
  "ASTM A312 TP316L": {
    group: "Inoxidable Austenítico", standard: "ASTM A312", grade: "TP316L", type: "AISI 316L Austenitic SS",
    composition: { C: "≤0.030%", Cr: "16–18%", Ni: "10–14%", Mo: "2–3%", Mn: "≤2%" },
    mechanical: { tensile_min: 485, yield_min: 170, elongation: 35, hardness_bhn: 217 },
    thermal: { max_temp_c: 816, min_temp_c: -196, conductivity: 16 },
    density: 8.0, modulus: 193, cost_factor: 6.5,
    weldability: "Excelente", nelson_curve: null, nace_mr0175: false,
    corrosion_resistance: { h2s: 4, hcl: 3, sulfuric: 5, naphthenic: 5, caustic: 4, steam: 5, crude: 5, amines: 5, hf: 1 },
    notes: "Mo mejora resistencia a cloruros y H₂SO₄. Preferido en condensadores overhead y aminas. Riesgo SCC en cloruros altos.",
    color: "#10b981"
  },
  "ASTM A312 TP321": {
    group: "Inoxidable Austenítico", standard: "ASTM A312", grade: "TP321", type: "AISI 321 Ti-estabilizado",
    composition: { C: "≤0.080%", Cr: "17–19%", Ni: "9–12%", Ti: "≥5×C", Mn: "≤2%" },
    mechanical: { tensile_min: 515, yield_min: 205, elongation: 35, hardness_bhn: 217 },
    thermal: { max_temp_c: 899, min_temp_c: -196, conductivity: 16 },
    density: 7.9, modulus: 193, cost_factor: 7.2,
    weldability: "Muy Buena", nelson_curve: null, nace_mr0175: false,
    corrosion_resistance: { h2s: 3, hcl: 2, sulfuric: 4, naphthenic: 4, caustic: 4, steam: 5, crude: 4, amines: 5, hf: 1 },
    notes: "Ti estabiliza contra sensitización 425–870°C. Ideal ciclos térmicos. Colectores de proceso.",
    color: "#2dd4bf"
  },
  "ASTM A312 TP347": {
    group: "Inoxidable Austenítico", standard: "ASTM A312", grade: "TP347", type: "AISI 347 Nb-estabilizado",
    composition: { C: "≤0.080%", Cr: "17–19%", Ni: "9–13%", Nb: "≥10×C", Mn: "≤2%" },
    mechanical: { tensile_min: 515, yield_min: 205, elongation: 35, hardness_bhn: 217 },
    thermal: { max_temp_c: 899, min_temp_c: -196, conductivity: 16 },
    density: 7.9, modulus: 193, cost_factor: 7.8,
    weldability: "Muy Buena", nelson_curve: null, nace_mr0175: false,
    corrosion_resistance: { h2s: 3, hcl: 2, sulfuric: 4, naphthenic: 5, caustic: 4, steam: 5, crude: 4, amines: 5, hf: 1 },
    notes: "Nb estabiliza como Ti. Mejor resistencia a fluencia que TP321. Colectores de alta temperatura.",
    color: "#34d399"
  },
  "ASTM A312 TP310S": {
    group: "Inoxidable Austenítico", standard: "ASTM A312", grade: "TP310S", type: "AISI 310S Alta Cr-Ni",
    composition: { C: "≤0.08%", Cr: "24–26%", Ni: "19–22%", Mn: "≤2%" },
    mechanical: { tensile_min: 515, yield_min: 205, elongation: 40, hardness_bhn: 217 },
    thermal: { max_temp_c: 1093, min_temp_c: -196, conductivity: 14 },
    density: 7.98, modulus: 200, cost_factor: 9.5,
    weldability: "Buena", nelson_curve: null, nace_mr0175: false,
    corrosion_resistance: { h2s: 4, hcl: 3, sulfuric: 5, naphthenic: 5, caustic: 4, steam: 5, crude: 5, amines: 5, hf: 2 },
    notes: "Máxima resistencia a oxidación >900°C. Hornos de proceso y quemadores.",
    color: "#14b8a6"
  },
  "ASTM A790 S31803": {
    group: "Inoxidable Dúplex", standard: "ASTM A790", grade: "S31803 (2205)", type: "Duplex 2205 Ferritic-Austenitic",
    composition: { C: "≤0.030%", Cr: "21–23%", Ni: "4.5–6.5%", Mo: "2.5–3.5%", N: "0.08–0.20%" },
    mechanical: { tensile_min: 620, yield_min: 450, elongation: 25, hardness_bhn: 293 },
    thermal: { max_temp_c: 316, min_temp_c: -46, conductivity: 19 },
    density: 7.8, modulus: 200, cost_factor: 8.5,
    weldability: "Buena (control dilución)", nelson_curve: null, nace_mr0175: true,
    corrosion_resistance: { h2s: 5, hcl: 4, sulfuric: 5, naphthenic: 4, caustic: 3, steam: 3, crude: 4, amines: 4, hf: 2 },
    notes: "Resist. mecánica 2× austenítico. Excelente SCC/H₂S. T. máx. 316°C (fragilización σ). NACE MR0175.",
    color: "#0ea5e9"
  },
  "ASTM A790 S32750": {
    group: "Inoxidable Dúplex", standard: "ASTM A790", grade: "S32750 (Super Duplex)", type: "Super Duplex 2507",
    composition: { C: "≤0.030%", Cr: "24–26%", Ni: "6–8%", Mo: "3–5%", N: "0.24–0.32%" },
    mechanical: { tensile_min: 795, yield_min: 550, elongation: 15, hardness_bhn: 310 },
    thermal: { max_temp_c: 300, min_temp_c: -50, conductivity: 17 },
    density: 7.8, modulus: 200, cost_factor: 12.0,
    weldability: "Difícil (control preciso)", nelson_curve: null, nace_mr0175: true,
    corrosion_resistance: { h2s: 5, hcl: 5, sulfuric: 5, naphthenic: 5, caustic: 3, steam: 3, crude: 5, amines: 4, hf: 3 },
    notes: "Máxima resistencia SCC, cloruros y H₂S entre dúplex. PRE≥43. T. máx. muy limitada. Offshore/sour service severo.",
    color: "#38bdf8"
  },
  "ASTM B407 N08800": {
    group: "Aleación de Níquel", standard: "ASTM B407", grade: "N08800 (Incoloy 800H)", type: "Fe-Ni-Cr Alta Temperatura",
    composition: { Ni: "30–35%", Fe: "≥39.5%", Cr: "19–23%", C: "0.05–0.10%", Ti: "0.15–0.60%", Al: "0.15–0.60%" },
    mechanical: { tensile_min: 517, yield_min: 207, elongation: 30, hardness_bhn: 160 },
    thermal: { max_temp_c: 982, min_temp_c: -196, conductivity: 12 },
    density: 7.94, modulus: 196, cost_factor: 15.0,
    weldability: "Buena", nelson_curve: null, nace_mr0175: false,
    corrosion_resistance: { h2s: 4, hcl: 3, sulfuric: 4, naphthenic: 5, caustic: 5, steam: 5, crude: 5, amines: 5, hf: 3 },
    notes: "Resistente a carburización y nitruración hasta 982°C. Tubos de hornos de proceso. Cáustico concentrado caliente.",
    color: "#d946ef"
  },
  "ASTM B423 N08825": {
    group: "Aleación de Níquel", standard: "ASTM B423", grade: "N08825 (Incoloy 825)", type: "Ni-Fe-Cr-Mo Altamente Resistente",
    composition: { Ni: "38–46%", Fe: "Balance", Cr: "19.5–23.5%", Mo: "2.5–3.5%", Cu: "1.5–3.0%", Ti: "0.6–1.2%" },
    mechanical: { tensile_min: 586, yield_min: 241, elongation: 30, hardness_bhn: 170 },
    thermal: { max_temp_c: 538, min_temp_c: -196, conductivity: 11 },
    density: 8.14, modulus: 196, cost_factor: 18.0,
    weldability: "Buena", nelson_curve: null, nace_mr0175: true,
    corrosion_resistance: { h2s: 5, hcl: 4, sulfuric: 5, naphthenic: 5, caustic: 5, steam: 4, crude: 5, amines: 5, hf: 4 },
    notes: "Excelente en HF diluido, H₂SO₄ caliente, H₂S y cloruros. Alquilación HF. Muy costoso.",
    color: "#c026d3"
  },
  "ASTM A105": {
    group: "Forjas / Accesorios CS", standard: "ASTM A105", grade: "—", type: "CS - Forja Bridas y Accesorios",
    composition: { C: "≤0.35%", Mn: "0.60–1.05%", P: "≤0.035%", S: "≤0.040%", Si: "0.10–0.35%" },
    mechanical: { tensile_min: 485, yield_min: 250, elongation: 22, hardness_bhn: 187 },
    thermal: { max_temp_c: 425, min_temp_c: -29, conductivity: 50 },
    density: 7.85, modulus: 200, cost_factor: 1.20,
    weldability: "Buena (precalentar)", nelson_curve: "Carbon Steel", nace_mr0175: false,
    corrosion_resistance: { h2s: 2, hcl: 1, sulfuric: 2, naphthenic: 2, caustic: 3, steam: 3, crude: 3, amines: 2, hf: 1 },
    notes: "Estándar bridas, cuellos de válvulas, accesorios CS. Par con A106 Gr.B. PWHT si C>0.30% o e>38mm.",
    color: "#fcd34d"
  },
  "ASTM A182 F11": {
    group: "Forjas / Accesorios Cr-Mo", standard: "ASTM A182", grade: "F11 (1.25Cr-0.5Mo)", type: "Cr-Mo Forja Bridas",
    composition: { C: "0.05–0.15%", Mn: "0.30–0.60%", Cr: "1.00–1.50%", Mo: "0.44–0.65%" },
    mechanical: { tensile_min: 483, yield_min: 276, elongation: 20, hardness_bhn: 163 },
    thermal: { max_temp_c: 593, min_temp_c: -29, conductivity: 42 },
    density: 7.83, modulus: 195, cost_factor: 3.2,
    weldability: "Buena (PWHT req.)", nelson_curve: "1.25Cr-0.5Mo", nace_mr0175: true,
    corrosion_resistance: { h2s: 3, hcl: 2, sulfuric: 3, naphthenic: 4, caustic: 3, steam: 5, crude: 4, amines: 3, hf: 1 },
    notes: "Par con A335 P11. Obligatorio en sistemas Cr-Mo. Mismo PWHT que tubería.",
    color: "#c4b5fd"
  },
  "ASTM A182 F22": {
    group: "Forjas / Accesorios Cr-Mo", standard: "ASTM A182", grade: "F22 (2.25Cr-1Mo)", type: "Cr-Mo Forja Bridas",
    composition: { C: "0.05–0.15%", Mn: "0.30–0.60%", Cr: "1.90–2.60%", Mo: "0.87–1.13%" },
    mechanical: { tensile_min: 483, yield_min: 276, elongation: 20, hardness_bhn: 163 },
    thermal: { max_temp_c: 649, min_temp_c: -29, conductivity: 38 },
    density: 7.82, modulus: 192, cost_factor: 4.0,
    weldability: "Moderada (PWHT req.)", nelson_curve: "2.25Cr-1Mo", nace_mr0175: true,
    corrosion_resistance: { h2s: 4, hcl: 2, sulfuric: 3, naphthenic: 5, caustic: 3, steam: 5, crude: 5, amines: 3, hf: 1 },
    notes: "Par con A335 P22. Esencial en sistemas de vacío. No mezclar con CS en el mismo sistema.",
    color: "#f472b6"
  },
  "ASTM A182 F91": {
    group: "Forjas / Accesorios Cr-Mo", standard: "ASTM A182", grade: "F91 (9Cr-1Mo-V)", type: "Cr-Mo-V Forja Bridas",
    composition: { C: "0.08–0.12%", Cr: "8.00–9.50%", Mo: "0.85–1.05%", V: "0.18–0.25%", Nb: "0.06–0.10%" },
    mechanical: { tensile_min: 585, yield_min: 415, elongation: 20, hardness_bhn: 248 },
    thermal: { max_temp_c: 649, min_temp_c: -29, conductivity: 29 },
    density: 7.75, modulus: 210, cost_factor: 8.0,
    weldability: "Muy Difícil (PWHT crítico)", nelson_curve: "9Cr-1Mo", nace_mr0175: true,
    corrosion_resistance: { h2s: 5, hcl: 3, sulfuric: 4, naphthenic: 5, caustic: 3, steam: 5, crude: 5, amines: 4, hf: 2 },
    notes: "Par con A335 P91. PWHT con ventanas de temperatura estrictas. Riesgo envejecimiento Tipo IV en ZAC.",
    color: "#e879f9"
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// NELSON CURVES — API 941 8th Edition (2016)
// Zona SEGURA = DEBAJO de la curva
// Puntos: { temp: °C, ph2: MPa absoluto }
// ══════════════════════════════════════════════════════════════════════════════
const NELSON_CURVES = {
  "Carbon Steel": {
    color: "#f59e0b", dash: "0",
    points: [
      {temp:200,ph2:0.10},{temp:218,ph2:0.30},{temp:232,ph2:0.70},{temp:246,ph2:1.40},
      {temp:260,ph2:2.80},{temp:274,ph2:5.50},{temp:288,ph2:7.00},{temp:316,ph2:10.0}
    ],
    warning: "⚠️ C-0.5Mo (P1): NO usar como sustituto — comportamiento HTHA inconsistente. Eliminar de nuevos diseños.",
    note: "Límite conservador según API 941. Daño HTHA irreversible. Operar estrictamente debajo."
  },
  "C-0.5Mo": {
    color: "#fb923c", dash: "8 4",
    points: [
      {temp:218,ph2:0.10},{temp:246,ph2:0.30},{temp:274,ph2:0.70},{temp:300,ph2:1.40},
      {temp:320,ph2:2.80},{temp:340,ph2:5.50},{temp:357,ph2:7.00},{temp:375,ph2:10.0}
    ],
    warning: "⚠️ ADVERTENCIA API 941 8va Ed.: C-0.5Mo (A335 P1) ha causado fallas HTHA inesperadas en servicio. NO recomendado para nuevos diseños. Usar curva de Carbon Steel como conservadora.",
    note: "Historial documentado de fallas en servicio. API 941 recomienda usar curva CS para este material."
  },
  "1.25Cr-0.5Mo": {
    color: "#8b5cf6", dash: "0",
    points: [
      {temp:288,ph2:0.10},{temp:316,ph2:0.30},{temp:343,ph2:0.70},{temp:371,ph2:1.40},
      {temp:399,ph2:2.80},{temp:427,ph2:5.50},{temp:441,ph2:7.00},{temp:454,ph2:10.0}
    ],
    warning: null,
    note: "A335 P11 / A182 F11. PWHT obligatorio. Buen balance costo/rendimiento para HDT moderado."
  },
  "2.25Cr-1Mo": {
    color: "#ec4899", dash: "0",
    points: [
      {temp:343,ph2:0.10},{temp:371,ph2:0.30},{temp:399,ph2:0.70},{temp:427,ph2:1.40},
      {temp:454,ph2:2.80},{temp:482,ph2:5.50},{temp:496,ph2:7.00},{temp:510,ph2:10.0}
    ],
    warning: null,
    note: "A335 P22 / A182 F22. Estándar de industria para H₂ alta T/P. PWHT estricto."
  },
  "3Cr-1Mo": {
    color: "#f472b6", dash: "4 2",
    points: [
      {temp:371,ph2:0.10},{temp:399,ph2:0.30},{temp:427,ph2:0.70},{temp:454,ph2:1.40},
      {temp:482,ph2:2.80},{temp:510,ph2:5.50},{temp:524,ph2:7.00},{temp:538,ph2:10.0}
    ],
    warning: null,
    note: "A335 P21. Intermedio P22–P5. Disponibilidad limitada en mercado."
  },
  "5Cr-0.5Mo": {
    color: "#f97316", dash: "0",
    points: [
      {temp:399,ph2:0.10},{temp:427,ph2:0.30},{temp:454,ph2:0.70},{temp:482,ph2:1.40},
      {temp:510,ph2:2.80},{temp:538,ph2:5.50},{temp:552,ph2:7.00},{temp:566,ph2:10.0}
    ],
    warning: null,
    note: "A335 P5 / A691 CM-65. Excelente H₂S+HTHA. Reformación y HDT severo."
  },
  "9Cr-1Mo": {
    color: "#e879f9", dash: "0",
    points: [
      {temp:441,ph2:0.10},{temp:468,ph2:0.30},{temp:496,ph2:0.70},{temp:524,ph2:1.40},
      {temp:538,ph2:2.80},{temp:552,ph2:5.50},{temp:566,ph2:7.00},{temp:580,ph2:10.0}
    ],
    warning: null,
    note: "A335 P9 y P91. Mayor resistencia HTHA en aceros Cr-Mo estándar."
  }
};

const buildNelsonLineData = () => {
  const allTemps = new Set();
  Object.values(NELSON_CURVES).forEach(c => c.points.forEach(p => allTemps.add(p.temp)));
  return [...allTemps].sort((a,b)=>a-b).map(temp => {
    const row = { temp };
    Object.entries(NELSON_CURVES).forEach(([name, curve]) => {
      const exact = curve.points.find(p => p.temp === temp);
      if (exact) { row[name] = exact.ph2; return; }
      const sorted = [...curve.points].sort((a,b)=>a.temp-b.temp);
      const lo = [...sorted].reverse().find(p=>p.temp<temp);
      const hi = sorted.find(p=>p.temp>temp);
      if (lo && hi) {
        const frac = (temp-lo.temp)/(hi.temp-lo.temp);
        row[name] = parseFloat((lo.ph2+frac*(hi.ph2-lo.ph2)).toFixed(3));
      }
    });
    return row;
  });
};

function evaluateNelson(matName, opTemp, opPH2) {
  const mat = MATERIALS_DB[matName];
  if (!mat || !mat.nelson_curve || !NELSON_CURVES[mat.nelson_curve]) return null;
  const sorted = [...NELSON_CURVES[mat.nelson_curve].points].sort((a,b)=>a.temp-b.temp);
  if (opTemp < sorted[0].temp) return { status: "safe", limit: sorted[0].ph2, margin: sorted[0].ph2-opPH2, curveName: mat.nelson_curve };
  if (opTemp > sorted[sorted.length-1].temp) return { status: "danger", limit: 0, margin: -opPH2, curveName: mat.nelson_curve };
  const lo = [...sorted].reverse().find(p=>p.temp<=opTemp);
  const hi = sorted.find(p=>p.temp>opTemp);
  if (!lo||!hi) return null;
  const frac = (opTemp-lo.temp)/(hi.temp-lo.temp);
  const limitPH2 = lo.ph2+frac*(hi.ph2-lo.ph2);
  const margin = limitPH2-opPH2;
  return {
    status: opPH2>=limitPH2 ? "danger" : margin<limitPH2*0.20 ? "caution" : "safe",
    limit: parseFloat(limitPH2.toFixed(3)),
    margin: parseFloat(margin.toFixed(3)),
    curveName: mat.nelson_curve
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// PROCESS ENVIRONMENTS
// ══════════════════════════════════════════════════════════════════════════════
const PROCESS_ENVIRONMENTS = {
  "Unidad de Vacío — Fondo": {
    temp_range:[340,400], pressure:[10,30], pressure_unit:"mmHg", ph_range:[5.5,7.0], h2_partial:0.0,
    chemicals:["naphthenic","h2s","crude"], severity:"Alta", icon:"🏭",
    description:"Residuo de vacío, ácidos nafténicos activos >370°C (TAN>0.5 mgKOH/g), H₂S disuelto. Erosión-corrosión en codos y reducciones."
  },
  "Unidad de Vacío — Overhead": {
    temp_range:[60,120], pressure:[10,50], pressure_unit:"mmHg", ph_range:[4.0,6.5], h2_partial:0.0,
    chemicals:["hcl","h2s","sulfuric"], severity:"Muy Alta", icon:"⚠️",
    description:"Punto de rocío ácido crítico. HCl concentrado al condensar. H₂S + HCl ataque agresivo. Depósitos de sales de amonio."
  },
  "Destilación Atmosférica — Crudo": {
    temp_range:[250,370], pressure:[1,3], pressure_unit:"atm", ph_range:[5.0,7.5], h2_partial:0.0,
    chemicals:["crude","h2s","naphthenic"], severity:"Media-Alta", icon:"🛢️",
    description:"Crudo caliente. H₂S activo >200°C. Nafténicos activados >230°C. Erosión-corrosión en alta velocidad."
  },
  "Hidrotratamiento (HDT)": {
    temp_range:[320,430], pressure:[30,100], pressure_unit:"bar", ph_range:[6.5,7.5], h2_partial:15.0,
    chemicals:["h2s","hcl","crude"], severity:"Muy Alta", icon:"⚡",
    description:"H₂ alta P parcial + H₂S: riesgo HTHA — revisar Curvas Nelson. Sales NH₄Cl en enfriamiento."
  },
  "Reformación Catalítica": {
    temp_range:[450,540], pressure:[3,35], pressure_unit:"bar", ph_range:[6.5,8.0], h2_partial:8.0,
    chemicals:["h2s","steam"], severity:"Alta", icon:"🔥",
    description:"Alta T con H₂. Riesgo carburización >650°C. Verificar creep en CS. Nelson curves aplicables."
  },
  "Alquilación con HF": {
    temp_range:[20,65], pressure:[3,15], pressure_unit:"bar", ph_range:[1.5,3.5], h2_partial:0.0,
    chemicals:["hf","hcl"], severity:"Extrema", icon:"☢️",
    description:"HF anhidro/concentrado. Solo materiales específicos (Incoloy 825, CS en régimen seco). NACE SP0472."
  },
  "Stripper de Aminas": {
    temp_range:[100,140], pressure:[1,3], pressure_unit:"bar", ph_range:[7.5,10.0], h2_partial:0.0,
    chemicals:["amines","h2s"], severity:"Media", icon:"🧪",
    description:"Aminas calientes (MDEA/DEA) con H₂S absorbido. Degradación → ácidos orgánicos. Riesgo erosión-corrosión."
  },
  "Aguas Amargas (Sour Water)": {
    temp_range:[40,90], pressure:[1,5], pressure_unit:"bar", ph_range:[7.0,9.5], h2_partial:0.0,
    chemicals:["h2s","caustic"], severity:"Alta", icon:"💧",
    description:"H₂S + NH₃ disueltos. Riesgo HIC/SOHIC en CS. Hardness Brinell crítica ≤200 BHN. NACE MR0175."
  },
  "Vapor de Proceso": {
    temp_range:[150,480], pressure:[3,100], pressure_unit:"bar", ph_range:[8.5,10.5], h2_partial:0.0,
    chemicals:["steam","caustic"], severity:"Media", icon:"💨",
    description:"Vapor sat./sobrecalentado. FAC en codos y tés. pH control crítico. A106 hasta 510°C; P11 hasta 593°C."
  },
  "Personalizado": {
    temp_range:[0,0], pressure:[0,0], pressure_unit:"", ph_range:[7,7], h2_partial:0.0,
    chemicals:[], severity:"", icon:"✏️",
    description:"Define las condiciones manualmente según tu proceso."
  }
};

const CHEMICAL_LABELS = {
  h2s:"H₂S / Sour", hcl:"HCl / Cloruros", sulfuric:"H₂SO₄",
  naphthenic:"Ác. Nafténicos", caustic:"NaOH / Cáustico", steam:"Vapor / Alta Temp.",
  crude:"Crudo / Hidrocarburos", amines:"Aminas (MDEA/DEA)", hf:"HF (Fluorhídrico)"
};

const SC = (v) => v>=4.5?"#10b981":v>=3.5?"#84cc16":v>=2.5?"#f59e0b":v>=1.5?"#f97316":"#ef4444";
const SL = (v) => v>=4.5?"Excelente":v>=3.5?"Buena":v>=2.5?"Moderada":v>=1.5?"Limitada":"No Apta";

// ══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [sel, setSel] = useState(["ASTM A53 Gr.B","ASTM A106 Gr.B","ASTM A335 P22"]);
  const [env, setEnv] = useState("Unidad de Vacío — Fondo");
  const [cond, setCond] = useState({temp:370,pressure:20,ph:6.0,velocity:2.5,pipe_size:"4in",h2_partial:0.0});
  const [tab, setTab] = useState("compare");
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [groupFilter, setGroupFilter] = useState("Todos");
  const [customNotes, setCustomNotes] = useState("");
  const [nelsonCurves, setNelsonCurves] = useState(Object.keys(NELSON_CURVES));

  const envData = PROCESS_ENVIRONMENTS[env];
  const available = Object.keys(MATERIALS_DB).filter(m=>!sel.includes(m));
  const groups = ["Todos",...new Set(Object.values(MATERIALS_DB).map(m=>m.group))];
  const filteredAvail = groupFilter==="Todos" ? available : available.filter(m=>MATERIALS_DB[m].group===groupFilter);

  const applyEnv = (name) => {
    const e = PROCESS_ENVIRONMENTS[name||env];
    if (!e||e.temp_range[0]===0) return;
    setCond(p=>({...p,
      temp: Math.round((e.temp_range[0]+e.temp_range[1])/2),
      pressure: parseFloat(((e.pressure[0]+e.pressure[1])/2).toFixed(1)),
      ph: parseFloat(((e.ph_range[0]+e.ph_range[1])/2).toFixed(1)),
      h2_partial: e.h2_partial||0
    }));
  };

  const score = (m) => {
    const mat = MATERIALS_DB[m]; if(!mat) return 0;
    const chems = envData.chemicals.length ? envData.chemicals : [];
    const chemS = chems.length ? chems.reduce((s,c)=>s+(mat.corrosion_resistance[c]||1),0)/chems.length : 3;
    const tOk = cond.temp<=mat.thermal.max_temp_c;
    const tMargin = Math.max(0,(mat.thermal.max_temp_c-cond.temp)/mat.thermal.max_temp_c);
    const tS = tOk ? Math.min(5,3+tMargin*4) : 0.5;
    const nr = evaluateNelson(m,cond.temp,cond.h2_partial);
    const nP = nr?.status==="danger"?-2:nr?.status==="caution"?-0.5:0;
    return Math.max(0,parseFloat((chemS*0.6+tS*0.4+nP).toFixed(2)));
  };

  const callAI = async () => {
    setAiLoading(true); setAiResult(null);
    const mats = sel.map(m=>{
      const mat=MATERIALS_DB[m], s=score(m), nr=evaluateNelson(m,cond.temp,cond.h2_partial);
      const nStr=nr?`Nelson: ${nr.status.toUpperCase()} (límite=${nr.limit}MPa, actual=${cond.h2_partial}MPa)`:"Nelson: No aplica";
      return `• ${m} [${mat.group}]: Score=${s}/5, TMax=${mat.thermal.max_temp_c}°C, Costo=${mat.cost_factor}×, NACE=${mat.nace_mr0175}, ${nStr}`;
    }).join("\n");
    const prompt = `Eres un experto en integridad mecánica y materiales para refinerías (30 años experiencia).

MATERIALES EN EVALUACIÓN:
${mats}

CONDICIONES:
- Proceso: ${env}
- Descripción: ${envData.description}
- Temperatura: ${cond.temp}°C | Presión: ${cond.pressure} ${envData.pressure_unit} | pH: ${cond.ph}
- Velocidad: ${cond.velocity} m/s | Tubería: ${cond.pipe_size} | P. Parcial H₂: ${cond.h2_partial} MPa
- Agentes químicos: ${envData.chemicals.map(c=>CHEMICAL_LABELS[c]).join(", ")||"Sin especificar"}
- Notas: ${customNotes||"Ninguna"}

Proporciona análisis técnico estructurado:

**1. RECOMENDACIÓN PRINCIPAL**
Material a usar y argumentos técnicos concretos con mecanismos de daño activos.

**2. MECANISMOS DE DAÑO ESPERADOS**
Por material: HTHA (si aplica API 941), SSC/HIC/SOHIC por H₂S, erosión-corrosión nafténica, SCC cloruros, FAC, corrosión bajo depósito, etc.

**3. VIDA ÚTIL RELATIVA ESTIMADA**
Años orientativos por material. Comparativo.

**4. NORMAS APLICABLES**
NACE MR0175/ISO 15156, API 941, API 570, ASME B31.3, API RP 939-C, NACE SP0472, etc.

**5. ESTRATEGIA ANTI-FALLAS NO PREVISTAS**
Monitoreo (UT, GWT, TOFD), frecuencia inspección API 570/510, inhibidores, modificaciones proceso.

Responder en español. Técnico, concreto y accionable.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:prompt}]})
      });
      const data = await res.json();
      setAiResult(data.content?.map(b=>b.text||"").join("")||"Sin respuesta.");
    } catch { setAiResult("Error de conexión con el motor de análisis."); }
    setAiLoading(false);
  };

  const nelsonLineData = useMemo(()=>buildNelsonLineData(),[]);

  const radarData = ["tensile","hardness","temp","corrosion","cost_inv","weldability"].map(k=>{
    const row={subject:{tensile:"Resistencia",hardness:"Dureza",temp:"Temp. Máx.",corrosion:"Anti-Corrosión",cost_inv:"Economía",weldability:"Soldabilidad"}[k]};
    sel.forEach(m=>{
      const mat=MATERIALS_DB[m]; if(!mat) return;
      let v;
      if(k==="tensile") v=((mat.mechanical.tensile_min-350)/500)*5;
      else if(k==="hardness") v=(mat.mechanical.hardness_bhn/350)*5;
      else if(k==="temp") v=(mat.thermal.max_temp_c/1100)*5;
      else if(k==="corrosion") v=score(m);
      else if(k==="cost_inv") v=Math.max(0.3,5-mat.cost_factor*0.28);
      else if(k==="weldability") v={
        "Excelente":5,"Muy Buena":4,"Buena":3,"Buena (PWHT req.)":2.8,"Buena (precalentar)":2.8,
        "Buena (PWHT opcional)":3,"Moderada":2.2,"Moderada (PWHT req.)":2,
        "Difícil (PWHT req.)":1.5,"Muy Difícil (PWHT crítico)":1,"Difícil (control preciso)":1.5,
        "Buena (control dilución)":2.8,"N/A (forja)":0
      }[mat.weldability]||2.5;
      row[m]=parseFloat(Math.min(5,Math.max(0,v)).toFixed(2));
    });
    return row;
  });

  const barData=(envData.chemicals.length?envData.chemicals:Object.keys(CHEMICAL_LABELS)).map(c=>({
    chemical:CHEMICAL_LABELS[c],
    ...Object.fromEntries(sel.map(m=>[m,MATERIALS_DB[m]?.corrosion_resistance[c]||0]))
  }));

  const renderAI = (text) => text.split("\n").map((line,i)=>{
    if(/^\*\*[^*]+\*\*$/.test(line.trim())) return <p key={i} style={{color:"#f59e0b",fontWeight:700,marginTop:"1rem",marginBottom:"0.2rem",fontSize:"0.72rem",borderBottom:"1px solid #1e3a5f",paddingBottom:"0.25rem"}}>{line.replace(/\*\*/g,"")}</p>;
    if(line.match(/\*\*(.+?)\*\*/)) return <p key={i} style={{color:"#e2e8f0",marginBottom:"0.25rem",fontSize:"0.68rem"}} dangerouslySetInnerHTML={{__html:line.replace(/\*\*(.+?)\*\*/g,'<span style="color:#f59e0b;font-weight:700">$1</span>')}} />;
    if(line.startsWith("• ")||line.startsWith("- ")) return <p key={i} style={{color:"#94a3b8",paddingLeft:"1rem",margin:"0.15rem 0",borderLeft:"2px solid #1e3a5f",fontSize:"0.66rem"}}>{line}</p>;
    if(line.trim()==="") return <br key={i}/>;
    return <p key={i} style={{color:"#cbd5e1",margin:"0.15rem 0",fontSize:"0.68rem"}}>{line}</p>;
  });

  const B = (s)=>({style:{...s}});
  const sC = {danger:"#ef4444",caution:"#f59e0b",safe:"#10b981"};

  return (
    <div style={{minHeight:"100vh",background:"#070c14",fontFamily:"'IBM Plex Mono','Courier New',monospace",color:"#e2e8f0"}}>
      <div style={{position:"fixed",inset:0,backgroundImage:"linear-gradient(#1e293b18 1px,transparent 1px),linear-gradient(90deg,#1e293b18 1px,transparent 1px)",backgroundSize:"40px 40px",pointerEvents:"none",zIndex:0}}/>

      {/* HEADER */}
      <header style={{position:"relative",zIndex:10,borderBottom:"1px solid #1e3a5f",background:"linear-gradient(90deg,#070c14,#0d1826)",padding:"0.85rem 2rem"}}>
        <div style={{display:"flex",alignItems:"center",gap:"1rem",flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:"0.75rem"}}>
            <div style={{width:38,height:38,background:"linear-gradient(135deg,#f59e0b,#d97706)",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.3rem"}}>⚙️</div>
            <div>
              <h1 style={{margin:0,fontSize:"1.05rem",fontWeight:700,letterSpacing:"0.1em",color:"#f59e0b",textTransform:"uppercase"}}>MaterialSpec Pro</h1>
              <p style={{margin:0,fontSize:"0.58rem",color:"#475569",letterSpacing:"0.05em"}}>v2.0 — 25 MATERIALES — CURVAS DE NELSON API 941 — INTEGRIDAD DE TUBERÍAS</p>
            </div>
          </div>
          <div style={{marginLeft:"auto",display:"flex",gap:"1.2rem",fontSize:"0.58rem",color:"#334155",flexWrap:"wrap"}}>
            {["ASTM/ASME","API 941","NACE MR0175","ISO 15156","API 570","API RP 939-C"].map(s=><span key={s}>⬡ {s}</span>)}
          </div>
        </div>
      </header>

      <div style={{position:"relative",zIndex:10,maxWidth:1400,margin:"0 auto",padding:"1.25rem 1.5rem"}}>

        {/* ENVIRONMENT */}
        <section style={{background:"#0d1826",border:"1px solid #1e3a5f",borderRadius:8,padding:"1.1rem",marginBottom:"0.9rem"}}>
          <label style={{fontSize:"0.58rem",color:"#f59e0b",letterSpacing:"0.12em",textTransform:"uppercase",display:"block",marginBottom:"0.65rem"}}>▸ Ambiente de Proceso</label>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:"0.4rem",marginBottom:"0.7rem"}}>
            {Object.entries(PROCESS_ENVIRONMENTS).map(([name,info])=>(
              <button key={name} onClick={()=>{setEnv(name);applyEnv(name);}}
                style={{background:env===name?"#1e3a5f":"#111827",border:`1px solid ${env===name?"#3b82f6":"#1e293b"}`,borderRadius:5,padding:"0.45rem 0.6rem",cursor:"pointer",textAlign:"left"}}>
                <div style={{fontSize:"0.66rem",color:env===name?"#93c5fd":"#cbd5e1"}}>{info.icon} {name}</div>
                {info.severity&&<div style={{fontSize:"0.56rem",color:{Extrema:"#dc2626","Muy Alta":"#ef4444",Alta:"#f97316","Media-Alta":"#f59e0b",Media:"#84cc16"}[info.severity]||"#64748b",marginTop:2}}>Severidad: {info.severity}</div>}
              </button>
            ))}
          </div>
          {envData.description&&<div style={{background:"#070c14",borderLeft:"3px solid #3b82f6",padding:"0.45rem 0.85rem",fontSize:"0.65rem",color:"#94a3b8",borderRadius:"0 4px 4px 0"}}>ℹ️ {envData.description}</div>}
        </section>

        {/* CONDITIONS */}
        <section style={{background:"#0d1826",border:"1px solid #1e3a5f",borderRadius:8,padding:"1.1rem",marginBottom:"0.9rem"}}>
          <label style={{fontSize:"0.58rem",color:"#f59e0b",letterSpacing:"0.12em",textTransform:"uppercase",display:"block",marginBottom:"0.65rem"}}>▸ Condiciones de Operación</label>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:"0.6rem"}}>
            {[
              {key:"temp",label:"Temperatura",unit:"°C",min:-196,max:1100},
              {key:"pressure",label:`Presión (${envData.pressure_unit||"bar"})`,unit:"",min:0,max:300},
              {key:"ph",label:"pH del fluido",unit:"pH",min:0,max:14,step:0.1},
              {key:"velocity",label:"Velocidad",unit:"m/s",min:0,max:30,step:0.1},
              {key:"h2_partial",label:"P. Parcial H₂ ⚡",unit:"MPa",min:0,max:20,step:0.1},
            ].map(({key,label,unit,min,max,step=1})=>(
              <div key={key} style={{background:"#111827",border:`1px solid ${key==="h2_partial"&&cond.h2_partial>0?"#f59e0b44":"#1e293b"}`,borderRadius:5,padding:"0.5rem 0.65rem"}}>
                <label style={{fontSize:"0.56rem",color:key==="h2_partial"?"#f59e0b":"#64748b",display:"block",marginBottom:3}}>{label} {unit&&`(${unit})`}</label>
                <input type="number" min={min} max={max} step={step} value={cond[key]}
                  onChange={e=>setCond(p=>({...p,[key]:parseFloat(e.target.value)||0}))}
                  style={{background:"transparent",border:"none",color:key==="h2_partial"?"#fcd34d":"#f59e0b",fontSize:"1rem",fontFamily:"inherit",width:"100%",outline:"none",fontWeight:700}}/>
              </div>
            ))}
            <div style={{background:"#111827",border:"1px solid #1e293b",borderRadius:5,padding:"0.5rem 0.65rem"}}>
              <label style={{fontSize:"0.56rem",color:"#64748b",display:"block",marginBottom:3}}>Diámetro</label>
              <select value={cond.pipe_size} onChange={e=>setCond(p=>({...p,pipe_size:e.target.value}))}
                style={{background:"#0d1826",border:"none",color:"#f59e0b",fontSize:"0.85rem",fontFamily:"inherit",width:"100%",outline:"none",fontWeight:700}}>
                {["0.5in","1in","1.5in","2in","3in","4in","6in","8in","10in","12in","16in","20in","24in","30in"].map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          {cond.h2_partial>0&&<div style={{marginTop:"0.5rem",background:"#1a1205",border:"1px solid #f59e0b44",borderRadius:4,padding:"0.4rem 0.75rem",fontSize:"0.62rem",color:"#fcd34d"}}>
            ⚡ pH₂ activo: {cond.h2_partial} MPa — Se evaluarán Curvas de Nelson (API 941) para materiales Cr-Mo
          </div>}
          <input type="text" value={customNotes} onChange={e=>setCustomNotes(e.target.value)}
            placeholder="Notas: historial de fallas, inhibidores activos, condiciones de upset, inspecciones previas..."
            style={{marginTop:"0.5rem",background:"#111827",border:"1px solid #1e293b",borderRadius:4,padding:"0.4rem 0.65rem",color:"#e2e8f0",fontSize:"0.65rem",fontFamily:"inherit",width:"100%",outline:"none",boxSizing:"border-box"}}/>
        </section>

        {/* MATERIALS */}
        <section style={{marginBottom:"0.9rem"}}>
          <div style={{display:"flex",alignItems:"center",gap:"0.65rem",marginBottom:"0.55rem",flexWrap:"wrap"}}>
            <label style={{fontSize:"0.58rem",color:"#f59e0b",letterSpacing:"0.12em",textTransform:"uppercase"}}>▸ Materiales ({sel.length})</label>
            <button onClick={()=>setAdding(!adding)} style={{background:"#1e3a5f",border:"1px solid #3b82f6",borderRadius:3,padding:"0.2rem 0.6rem",cursor:"pointer",color:"#93c5fd",fontSize:"0.6rem"}}>
              {adding?"✕ Cerrar":"+ Agregar Material"}
            </button>
          </div>
          {adding&&(
            <div style={{background:"#0d1826",border:"1px solid #1e3a5f",borderRadius:6,padding:"0.7rem",marginBottom:"0.65rem"}}>
              <div style={{display:"flex",gap:"0.35rem",flexWrap:"wrap",marginBottom:"0.45rem"}}>
                {groups.map(g=>(
                  <button key={g} onClick={()=>setGroupFilter(g)} style={{background:groupFilter===g?"#1e3a5f":"#111827",border:`1px solid ${groupFilter===g?"#3b82f6":"#1e293b"}`,borderRadius:3,padding:"0.18rem 0.45rem",cursor:"pointer",color:groupFilter===g?"#93c5fd":"#64748b",fontSize:"0.56rem"}}>{g}</button>
                ))}
              </div>
              <div style={{display:"flex",gap:"0.35rem",flexWrap:"wrap"}}>
                {filteredAvail.map(m=>(
                  <button key={m} onClick={()=>setSel(p=>[...p,m])} style={{background:"#111827",border:`1px solid ${MATERIALS_DB[m]?.color}44`,borderRadius:3,padding:"0.25rem 0.6rem",cursor:"pointer",color:MATERIALS_DB[m]?.color,fontSize:"0.62rem"}}>{m}</button>
                ))}
              </div>
            </div>
          )}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(205px,1fr))",gap:"0.6rem"}}>
            {sel.map(m=>{
              const mat=MATERIALS_DB[m]; const s=score(m); const nr=evaluateNelson(m,cond.temp,cond.h2_partial);
              return (
                <div key={m} style={{background:"#0d1826",border:`1px solid ${mat?.color}44`,borderRadius:7,padding:"0.85rem",position:"relative"}}>
                  <button onClick={()=>setSel(p=>p.filter(x=>x!==m))} style={{position:"absolute",top:6,right:6,background:"transparent",border:"none",color:"#475569",cursor:"pointer",fontSize:"0.85rem"}}>✕</button>
                  <div style={{fontSize:"0.56rem",color:"#475569",marginBottom:1}}>{mat?.group}</div>
                  <div style={{display:"flex",alignItems:"center",gap:"0.35rem",marginBottom:2}}>
                    <div style={{width:7,height:7,background:mat?.color,borderRadius:"50%",flexShrink:0}}/>
                    <span style={{fontSize:"0.7rem",fontWeight:700,color:mat?.color}}>{m}</span>
                  </div>
                  <div style={{fontSize:"0.56rem",color:"#475569",marginBottom:"0.55rem"}}>{mat?.type}</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.2rem 0.4rem",fontSize:"0.6rem",marginBottom:"0.55rem"}}>
                    <span style={{color:"#64748b"}}>Tracción</span><span style={{color:"#e2e8f0"}}>{mat?.mechanical.tensile_min} MPa</span>
                    <span style={{color:"#64748b"}}>Fluencia</span><span style={{color:"#e2e8f0"}}>{mat?.mechanical.yield_min} MPa</span>
                    <span style={{color:"#64748b"}}>Dureza</span><span style={{color:"#e2e8f0"}}>{mat?.mechanical.hardness_bhn} BHN</span>
                    <span style={{color:"#64748b"}}>T. Máx.</span><span style={{color:cond.temp>mat?.thermal.max_temp_c?"#ef4444":"#e2e8f0"}}>{mat?.thermal.max_temp_c}°C{cond.temp>mat?.thermal.max_temp_c?" ⚠️":""}</span>
                    <span style={{color:"#64748b"}}>Costo</span><span style={{color:"#e2e8f0"}}>{mat?.cost_factor}×</span>
                    <span style={{color:"#64748b"}}>NACE</span><span style={{color:mat?.nace_mr0175?"#10b981":"#ef444488"}}>{mat?.nace_mr0175?"✓ Sí":"✗ No"}</span>
                  </div>
                  {nr&&(
                    <div style={{background:`${sC[nr.status]}15`,border:`1px solid ${sC[nr.status]}44`,borderRadius:4,padding:"0.3rem 0.5rem",marginBottom:"0.45rem",fontSize:"0.58rem"}}>
                      <div style={{color:sC[nr.status],fontWeight:700}}>{nr.status==="danger"?"⛔ RIESGO HTHA":nr.status==="caution"?"⚠️ Próx. al límite":"✓ Nelson: Seguro"}</div>
                      <div style={{color:"#64748b",marginTop:1}}>Límite: {nr.limit} MPa | Margen: {nr.margin>0?"+":""}{nr.margin} MPa</div>
                    </div>
                  )}
                  <div style={{padding:"0.35rem 0.45rem",background:`${SC(s)}12`,border:`1px solid ${SC(s)}30`,borderRadius:4}}>
                    <div style={{fontSize:"0.54rem",color:"#64748b",marginBottom:2}}>Score ambiente actual</div>
                    <div style={{display:"flex",alignItems:"center",gap:"0.35rem"}}>
                      <div style={{flex:1,height:5,background:"#1e293b",borderRadius:3}}><div style={{width:`${s/5*100}%`,height:"100%",background:SC(s),borderRadius:3,transition:"width 0.3s"}}/></div>
                      <span style={{color:SC(s),fontSize:"0.7rem",fontWeight:700}}>{s}/5</span>
                    </div>
                    <div style={{fontSize:"0.56rem",color:SC(s),marginTop:1}}>{SL(s)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* TABS */}
        <div style={{display:"flex",gap:0,marginBottom:"0.9rem",borderBottom:"1px solid #1e293b",overflowX:"auto"}}>
          {[["compare","📊 Propiedades"],["corrosion","⚗️ Resist. Química"],["radar","🕸️ Radar"],["nelson","📈 Curvas Nelson"],["ai","🤖 Análisis IA"]].map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)}
              style={{background:tab===id?"#0d1826":"transparent",border:"none",borderBottom:`2px solid ${tab===id?"#f59e0b":"transparent"}`,borderRadius:"4px 4px 0 0",padding:"0.5rem 0.9rem",cursor:"pointer",color:tab===id?"#f59e0b":"#64748b",fontSize:"0.66rem",fontFamily:"inherit",whiteSpace:"nowrap"}}>
              {label}{id==="nelson"&&cond.h2_partial>0&&<span style={{background:"#ef4444",color:"#fff",borderRadius:3,padding:"0 4px",fontSize:"0.5rem",marginLeft:4}}>!</span>}
            </button>
          ))}
        </div>

        {/* ── PROPIEDADES ── */}
        {tab==="compare"&&(
          <section style={{background:"#0d1826",border:"1px solid #1e3a5f",borderRadius:8,overflow:"hidden"}}>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:"0.65rem"}}>
                <thead>
                  <tr style={{background:"#111827"}}>
                    <th style={{padding:"0.6rem 0.9rem",textAlign:"left",color:"#64748b",fontWeight:400,borderBottom:"1px solid #1e293b",minWidth:165}}>Propiedad</th>
                    {sel.map(m=>(
                      <th key={m} style={{padding:"0.6rem 0.7rem",textAlign:"center",borderBottom:"1px solid #1e293b",minWidth:155}}>
                        <div style={{width:7,height:7,background:MATERIALS_DB[m]?.color,borderRadius:"50%",display:"inline-block",marginRight:4}}/>
                        <span style={{color:MATERIALS_DB[m]?.color,fontWeight:700,fontSize:"0.62rem"}}>{m}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    {label:"Grupo",fn:m=>MATERIALS_DB[m]?.group},
                    {label:"Tipo / Norma",fn:m=>MATERIALS_DB[m]?.type},
                    {label:"Composición clave",fn:m=>Object.entries(MATERIALS_DB[m]?.composition||{}).map(([k,v])=>`${k}: ${v}`).join(" | ")},
                    {label:"Resist. Tracción (MPa)",fn:m=>MATERIALS_DB[m]?.mechanical.tensile_min,hi:"max"},
                    {label:"Límite Fluencia (MPa)",fn:m=>MATERIALS_DB[m]?.mechanical.yield_min,hi:"max"},
                    {label:"Elongación (%)",fn:m=>MATERIALS_DB[m]?.mechanical.elongation,hi:"max"},
                    {label:"Dureza (BHN)",fn:m=>MATERIALS_DB[m]?.mechanical.hardness_bhn},
                    {label:"Temp. Máx. (°C)",fn:m=>MATERIALS_DB[m]?.thermal.max_temp_c,hi:"max"},
                    {label:"Temp. Mín. (°C)",fn:m=>MATERIALS_DB[m]?.thermal.min_temp_c,hi:"min_better"},
                    {label:"Densidad (g/cm³)",fn:m=>MATERIALS_DB[m]?.density},
                    {label:"Módulo Elástico (GPa)",fn:m=>MATERIALS_DB[m]?.modulus},
                    {label:"Conductividad (W/m·K)",fn:m=>MATERIALS_DB[m]?.thermal.conductivity},
                    {label:"Costo Relativo",fn:m=>`${MATERIALS_DB[m]?.cost_factor}×`,hi:"min_num"},
                    {label:"Soldabilidad",fn:m=>MATERIALS_DB[m]?.weldability},
                    {label:"Curva Nelson (API 941)",fn:m=>MATERIALS_DB[m]?.nelson_curve||"No aplica"},
                    {label:"NACE MR0175 / ISO 15156",fn:m=>MATERIALS_DB[m]?.nace_mr0175?"✓ Aplica":"✗ No especif."},
                    {label:"Score Ambiente Actual",fn:m=>`${score(m)}/5 — ${SL(parseFloat(score(m)))}`,hi:"score"},
                    {label:"Notas",fn:m=>MATERIALS_DB[m]?.notes},
                  ].map(({label,fn,hi},ri)=>{
                    const vals=sel.map(fn);
                    const nums=vals.map(v=>parseFloat(v)).filter(n=>!isNaN(n));
                    const maxV=Math.max(...nums), minV=Math.min(...nums);
                    return (
                      <tr key={label} style={{background:ri%2===0?"#070c14":"#0d1826"}}>
                        <td style={{padding:"0.45rem 0.9rem",color:"#64748b",borderBottom:"1px solid #1e293b08",whiteSpace:"nowrap",fontSize:"0.6rem"}}>{label}</td>
                        {sel.map(m=>{
                          const val=fn(m); const num=parseFloat(val);
                          let cl="#e2e8f0";
                          if(hi==="max"&&!isNaN(num)) cl=num===maxV&&maxV!==minV?"#10b981":num===minV?"#ef444488":"#e2e8f0";
                          if(hi==="min_better"&&!isNaN(num)) cl=num===minV&&maxV!==minV?"#10b981":num===maxV?"#ef444488":"#e2e8f0";
                          if(hi==="min_num"&&!isNaN(num)) cl=num===minV&&maxV!==minV?"#10b981":num===maxV?"#ef444488":"#e2e8f0";
                          if(hi==="score"){const sc=parseFloat(val);cl=SC(sc);}
                          return <td key={m} style={{padding:"0.45rem 0.7rem",color:cl,borderBottom:"1px solid #1e293b08",textAlign:"center",fontSize:label==="Notas"?"0.56rem":"0.62rem",maxWidth:220,wordBreak:"break-word"}}>{val}</td>;
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── CORROSIÓN ── */}
        {tab==="corrosion"&&(
          <section>
            <div style={{background:"#0d1826",border:"1px solid #1e3a5f",borderRadius:8,padding:"1.1rem",marginBottom:"0.7rem"}}>
              <label style={{fontSize:"0.58rem",color:"#f59e0b",letterSpacing:"0.12em",textTransform:"uppercase",display:"block",marginBottom:"0.65rem"}}>Resistencia por Agente Químico (1=Nula → 5=Excelente)</label>
              <div style={{height:260}}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{left:10}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
                    <XAxis dataKey="chemical" tick={{fill:"#64748b",fontSize:9}}/>
                    <YAxis domain={[0,5]} tick={{fill:"#64748b",fontSize:9}}/>
                    <Tooltip contentStyle={{background:"#0d1826",border:"1px solid #1e3a5f",borderRadius:5,fontSize:"0.62rem"}}/>
                    <Legend wrapperStyle={{fontSize:"0.6rem"}}/>
                    {sel.map(m=><Bar key={m} dataKey={m} fill={MATERIALS_DB[m]?.color} radius={[3,3,0,0]}/>)}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:"0.55rem"}}>
              {Object.keys(CHEMICAL_LABELS).map(chem=>(
                <div key={chem} style={{background:"#0d1826",border:`1px solid ${envData.chemicals.includes(chem)?"#f59e0b44":"#1e3a5f"}`,borderRadius:6,padding:"0.65rem"}}>
                  <div style={{fontSize:"0.65rem",color:envData.chemicals.includes(chem)?"#f59e0b":"#64748b",marginBottom:"0.4rem",fontWeight:envData.chemicals.includes(chem)?700:400}}>
                    {envData.chemicals.includes(chem)?"▸ ":""}{CHEMICAL_LABELS[chem]}{envData.chemicals.includes(chem)?" — Presente":""}
                  </div>
                  {sel.map(m=>{
                    const s=MATERIALS_DB[m]?.corrosion_resistance[chem]||0;
                    return (
                      <div key={m} style={{display:"flex",alignItems:"center",gap:"0.35rem",marginBottom:3}}>
                        <div style={{width:7,height:7,background:MATERIALS_DB[m]?.color,borderRadius:"50%",flexShrink:0}}/>
                        <div style={{fontSize:"0.56rem",color:"#475569",width:135,flexShrink:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m}</div>
                        <div style={{flex:1,height:5,background:"#1e293b",borderRadius:3}}><div style={{width:`${s/5*100}%`,height:"100%",background:SC(s),borderRadius:3}}/></div>
                        <span style={{fontSize:"0.6rem",color:SC(s),width:16,textAlign:"right"}}>{s}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── RADAR ── */}
        {tab==="radar"&&(
          <section style={{background:"#0d1826",border:"1px solid #1e3a5f",borderRadius:8,padding:"1.1rem"}}>
            <label style={{fontSize:"0.58rem",color:"#f59e0b",letterSpacing:"0.12em",textTransform:"uppercase",display:"block",marginBottom:"0.65rem"}}>Perfil de Desempeño Global</label>
            <div style={{height:370}}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#1e293b"/>
                  <PolarAngleAxis dataKey="subject" tick={{fill:"#64748b",fontSize:11}}/>
                  {sel.map(m=><Radar key={m} name={m} dataKey={m} stroke={MATERIALS_DB[m]?.color} fill={MATERIALS_DB[m]?.color} fillOpacity={0.12} strokeWidth={2}/>)}
                  <Legend wrapperStyle={{fontSize:"0.62rem"}}/>
                  <Tooltip contentStyle={{background:"#0d1826",border:"1px solid #1e3a5f",borderRadius:5,fontSize:"0.62rem"}}/>
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {/* ── CURVAS DE NELSON ── */}
        {tab==="nelson"&&(
          <section>
            <div style={{background:"#0d1826",border:"1px solid #1e3a5f",borderRadius:8,padding:"1.1rem",marginBottom:"0.7rem"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"0.6rem",marginBottom:"0.65rem"}}>
                <div>
                  <label style={{fontSize:"0.58rem",color:"#f59e0b",letterSpacing:"0.12em",textTransform:"uppercase",display:"block"}}>Curvas de Nelson — API 941 (8va Edición, 2016)</label>
                  <p style={{margin:"0.25rem 0 0",fontSize:"0.62rem",color:"#64748b"}}>Prevención de HTHA (High Temperature Hydrogen Attack). Zona SEGURA = DEBAJO de la curva del material.</p>
                </div>
                <div style={{display:"flex",gap:"0.4rem"}}>
                  <button onClick={()=>setNelsonCurves(Object.keys(NELSON_CURVES))} style={{background:"#1e3a5f",border:"1px solid #3b82f6",borderRadius:3,padding:"0.2rem 0.55rem",cursor:"pointer",color:"#93c5fd",fontSize:"0.58rem"}}>Todas</button>
                  <button onClick={()=>setNelsonCurves([...new Set(sel.map(m=>MATERIALS_DB[m]?.nelson_curve).filter(Boolean))])} style={{background:"#111827",border:"1px solid #1e293b",borderRadius:3,padding:"0.2rem 0.55rem",cursor:"pointer",color:"#64748b",fontSize:"0.58rem"}}>Solo seleccionados</button>
                </div>
              </div>
              <div style={{display:"flex",gap:"0.3rem",flexWrap:"wrap",marginBottom:"0.65rem"}}>
                {Object.entries(NELSON_CURVES).map(([name,curve])=>(
                  <button key={name} onClick={()=>setNelsonCurves(p=>p.includes(name)?p.filter(c=>c!==name):[...p,name])}
                    style={{background:nelsonCurves.includes(name)?`${curve.color}18`:"#111827",border:`1px solid ${nelsonCurves.includes(name)?curve.color:"#1e293b"}`,borderRadius:4,padding:"0.2rem 0.55rem",cursor:"pointer",color:nelsonCurves.includes(name)?curve.color:"#475569",fontSize:"0.6rem",display:"flex",alignItems:"center",gap:"0.3rem"}}>
                    <span style={{display:"inline-block",width:12,height:2,background:curve.color,borderRadius:1}}/>
                    {name}{curve.dash!=="0"&&<span style={{fontSize:"0.5rem",color:"#f59e0b"}}>⚠️</span>}
                  </button>
                ))}
              </div>
              <div style={{height:370}}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={nelsonLineData} margin={{top:10,right:30,bottom:20,left:15}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
                    <XAxis dataKey="temp" type="number" domain={[180,620]} label={{value:"Temperatura (°C)",position:"insideBottom",offset:-10,fill:"#64748b",fontSize:11}} tick={{fill:"#64748b",fontSize:10}}/>
                    <YAxis domain={[0,10.5]} label={{value:"P. Parcial H₂ (MPa)",angle:-90,position:"insideLeft",fill:"#64748b",fontSize:10,offset:10}} tick={{fill:"#64748b",fontSize:10}}/>
                    <Tooltip contentStyle={{background:"#0d1826",border:"1px solid #1e3a5f",borderRadius:5,fontSize:"0.62rem"}} formatter={(v,n)=>[`${v} MPa`,n]} labelFormatter={t=>`Temp: ${t}°C`}/>
                    {Object.entries(NELSON_CURVES).filter(([n])=>nelsonCurves.includes(n)).map(([n,c])=>(
                      <Line key={n} type="monotone" dataKey={n} stroke={c.color} strokeWidth={2} dot={false} connectNulls strokeDasharray={c.dash} name={n} activeDot={{r:4}}/>
                    ))}
                    {cond.h2_partial>0&&(
                      <>
                        <ReferenceDot x={cond.temp} y={cond.h2_partial} r={8} fill="#ef444430" stroke="#ef4444" strokeWidth={2} label={{value:`OP: ${cond.temp}°C / ${cond.h2_partial}MPa`,fill:"#ef4444",fontSize:10,position:"top"}}/>
                        <ReferenceLine x={cond.temp} stroke="#ef444440" strokeDasharray="4 4"/>
                        <ReferenceLine y={cond.h2_partial} stroke="#ef444440" strokeDasharray="4 4"/>
                      </>
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
              {cond.h2_partial===0&&<div style={{textAlign:"center",marginTop:"0.4rem",fontSize:"0.62rem",color:"#475569"}}>💡 Ingresa P. Parcial H₂ {">"} 0 MPa en Condiciones de Operación para ver tu punto de operación</div>}
            </div>

            {/* Per-material Nelson evaluation */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:"0.6rem",marginBottom:"0.7rem"}}>
              {sel.filter(m=>MATERIALS_DB[m]?.nelson_curve).map(m=>{
                const mat=MATERIALS_DB[m], curve=NELSON_CURVES[mat.nelson_curve], nr=evaluateNelson(m,cond.temp,cond.h2_partial), sc=nr?.status||"safe";
                return (
                  <div key={m} style={{background:"#0d1826",border:`1px solid ${sC[sc]}44`,borderRadius:7,padding:"0.85rem"}}>
                    <div style={{display:"flex",alignItems:"center",gap:"0.35rem",marginBottom:"0.45rem"}}>
                      <div style={{width:7,height:7,background:mat.color,borderRadius:"50%"}}/>
                      <span style={{fontSize:"0.68rem",fontWeight:700,color:mat.color}}>{m}</span>
                      <span style={{marginLeft:"auto",fontSize:"0.58rem",color:"#475569"}}>Curva: {mat.nelson_curve}</span>
                    </div>
                    {nr?(
                      <div>
                        <div style={{background:`${sC[sc]}15`,border:`1px solid ${sC[sc]}44`,borderRadius:5,padding:"0.45rem 0.65rem",marginBottom:"0.45rem"}}>
                          <div style={{fontSize:"0.72rem",fontWeight:700,color:sC[sc]}}>
                            {sc==="safe"?"✅ ZONA SEGURA":sc==="caution"?"⚠️ PRECAUCIÓN":"⛔ ZONA PELIGRO — HTHA"}
                          </div>
                          <div style={{fontSize:"0.6rem",color:"#94a3b8",marginTop:2}}>Condición: {cond.temp}°C / {cond.h2_partial} MPa H₂</div>
                          <div style={{fontSize:"0.6rem",color:"#94a3b8"}}>Límite curva ({mat.nelson_curve}): {nr.limit} MPa a {cond.temp}°C</div>
                          <div style={{fontSize:"0.6rem",color:sC[sc],marginTop:2}}>Margen: {nr.margin>0?"+":""}{nr.margin} MPa{sc==="danger"?" — EXCEDE LA CURVA":sc==="caution"?" — Margen &lt;20%":""}</div>
                        </div>
                        {curve.warning&&<div style={{background:"#1a0a0520",border:"1px solid #f97316aa",borderRadius:4,padding:"0.35rem 0.55rem",fontSize:"0.58rem",color:"#fb923c",marginBottom:"0.4rem"}}>{curve.warning}</div>}
                        <div style={{fontSize:"0.58rem",color:"#475569"}}>{curve.note}</div>
                      </div>
                    ):<div style={{fontSize:"0.62rem",color:"#475569"}}>Configura P. Parcial H₂ {">"} 0 para evaluación HTHA</div>}
                  </div>
                );
              })}
              {sel.filter(m=>!MATERIALS_DB[m]?.nelson_curve).length>0&&(
                <div style={{background:"#0d1826",border:"1px solid #1e3a5f",borderRadius:7,padding:"0.85rem"}}>
                  <div style={{fontSize:"0.65rem",color:"#64748b",marginBottom:"0.4rem"}}>Materiales sin curva Nelson (resistencia inherente):</div>
                  {sel.filter(m=>!MATERIALS_DB[m]?.nelson_curve).map(m=>(
                    <div key={m} style={{fontSize:"0.6rem",color:MATERIALS_DB[m]?.color,marginBottom:3}}>• {m} — Austenitic SS / Dúplex / Ni: No susceptibles a HTHA</div>
                  ))}
                  <div style={{fontSize:"0.56rem",color:"#475569",marginTop:"0.4rem"}}>Los inoxidables austeníticos, dúplex y aleaciones de Ni no son susceptibles a HTHA bajo condiciones normales.</div>
                </div>
              )}
            </div>

            {/* Nelson guide table */}
            <div style={{background:"#0d1826",border:"1px solid #1e3a5f",borderRadius:8,padding:"1.1rem"}}>
              <label style={{fontSize:"0.58rem",color:"#f59e0b",letterSpacing:"0.12em",textTransform:"uppercase",display:"block",marginBottom:"0.65rem"}}>Guía de Selección — Curvas Nelson (API 941)</label>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:"0.6rem"}}>
                  <thead>
                    <tr style={{background:"#111827"}}>
                      {["Curva / Material","T. Máx. Orient.","pH₂ Máx. (MPa)","Normas de Tubería","Estado API 941","Observación"].map(h=>(
                        <th key={h} style={{padding:"0.45rem 0.7rem",textAlign:"left",color:"#64748b",fontWeight:400,borderBottom:"1px solid #1e293b",whiteSpace:"nowrap"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Carbon Steel","260°C","~2.8","A53 Gr.B, A106 Gr.B, A333 Gr.6, A105","Activo","Límite conservador. C-0.5Mo NO sustituye."],
                      ["C-0.5Mo","320°C","~5.5","A335 P1","⚠️ DESACONSEJADO","Fallas imprevistas. Usar curva CS o reemplazar por P11/P22."],
                      ["1.25Cr-0.5Mo","400°C","~7.0","A335 P11, A182 F11","Activo","PWHT obligatorio. Buen balance costo/rendimiento."],
                      ["2.25Cr-1Mo","454°C","~7.0","A335 P22, A182 F22","Activo","Estándar industria HDT. PWHT estricto."],
                      ["3Cr-1Mo","482°C","~7.0","A335 P21","Activo (disponib. limitada)","Intermedio P22–P5."],
                      ["5Cr-0.5Mo","510°C","~7.0","A335 P5, A691 CM-65","Activo","Excelente HTHA+H₂S. Reformación y HDT severo."],
                      ["9Cr-1Mo","552°C","~7.0","A335 P9, P91, A182 F91","Activo","Máxima resist. HTHA estándar. P91: PWHT crítico."],
                    ].map(([curve,tmax,ph2,normas,estado,obs],ri)=>(
                      <tr key={curve} style={{background:ri%2===0?"#070c14":"#0d1826"}}>
                        <td style={{padding:"0.4rem 0.7rem",color:NELSON_CURVES[curve]?.color||"#e2e8f0",fontWeight:600,whiteSpace:"nowrap"}}>{curve}</td>
                        <td style={{padding:"0.4rem 0.7rem",color:"#e2e8f0"}}>{tmax}</td>
                        <td style={{padding:"0.4rem 0.7rem",color:"#e2e8f0"}}>{ph2}</td>
                        <td style={{padding:"0.4rem 0.7rem",color:"#94a3b8",fontSize:"0.56rem"}}>{normas}</td>
                        <td style={{padding:"0.4rem 0.7rem",color:estado.includes("⚠️")?"#f97316":"#10b981",whiteSpace:"nowrap"}}>{estado}</td>
                        <td style={{padding:"0.4rem 0.7rem",color:"#64748b",fontSize:"0.56rem"}}>{obs}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* ── AI ── */}
        {tab==="ai"&&(
          <section style={{background:"#0d1826",border:"1px solid #1e3a5f",borderRadius:8,padding:"1.25rem"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"0.9rem",flexWrap:"wrap",gap:"0.65rem"}}>
              <div>
                <label style={{fontSize:"0.58rem",color:"#f59e0b",letterSpacing:"0.12em",textTransform:"uppercase",display:"block"}}>🤖 Análisis de Integridad con IA</label>
                <p style={{margin:"0.2rem 0 0",fontSize:"0.6rem",color:"#475569"}}>Mecanismos de daño · HTHA/Nelson · Normas · Estrategia de inspección</p>
              </div>
              <button onClick={callAI} disabled={aiLoading}
                style={{background:aiLoading?"#1e293b":"linear-gradient(135deg,#d97706,#f59e0b)",border:"none",borderRadius:6,padding:"0.55rem 1.4rem",cursor:aiLoading?"not-allowed":"pointer",color:aiLoading?"#64748b":"#070c14",fontSize:"0.7rem",fontFamily:"inherit",fontWeight:700}}>
                {aiLoading?"⏳ Analizando...":"▶ Generar Análisis Técnico"}
              </button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:"0.35rem",marginBottom:"0.9rem"}}>
              {[["Proceso",env],["Temperatura",`${cond.temp}°C`],["Presión",`${cond.pressure} ${envData.pressure_unit}`],["pH",cond.ph],["P. H₂",`${cond.h2_partial} MPa`],["Tubería",cond.pipe_size],["Materiales",`${sel.length} en comp.`]].map(([k,v])=>(
                <div key={k} style={{background:"#111827",border:"1px solid #1e293b",borderRadius:4,padding:"0.3rem 0.55rem"}}>
                  <div style={{fontSize:"0.54rem",color:"#64748b"}}>{k}</div>
                  <div style={{fontSize:"0.62rem",color:"#e2e8f0",wordBreak:"break-word"}}>{v}</div>
                </div>
              ))}
            </div>
            {aiLoading&&<div style={{textAlign:"center",padding:"2.5rem",color:"#475569"}}><div style={{fontSize:"2rem"}}>⚙️</div><div style={{fontSize:"0.65rem",marginTop:"0.4rem"}}>Consultando motor de análisis técnico...</div></div>}
            {aiResult&&!aiLoading&&<div style={{background:"#070c14",border:"1px solid #1e3a5f",borderRadius:6,padding:"1.1rem",maxHeight:560,overflowY:"auto"}}>{renderAI(aiResult)}</div>}
            {!aiResult&&!aiLoading&&(
              <div style={{textAlign:"center",padding:"2.5rem",color:"#334155",border:"1px dashed #1e293b",borderRadius:6}}>
                <div style={{fontSize:"2.5rem"}}>🔬</div>
                <div style={{fontSize:"0.68rem",marginTop:"0.4rem"}}>Configura ambiente, condiciones y materiales, luego presiona Generar Análisis</div>
              </div>
            )}
          </section>
        )}

        <footer style={{marginTop:"1.5rem",textAlign:"center",fontSize:"0.56rem",color:"#1e293b",paddingBottom:"1rem"}}>
          MATERIALSPEC PRO v2.0 — 25 MATERIALES — API 941 NELSON CURVES — ASTM / ASME / NACE MR0175 / ISO 15156 / API 570 / API RP 939-C
        </footer>
      </div>
    </div>
  );
}
