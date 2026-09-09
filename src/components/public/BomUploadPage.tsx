import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Layers,
  RefreshCw,
  Eye,
  FileText,
} from 'lucide-react';

export const BomUploadPage: React.FC = () => {
  const { navigateTo, addPartToDraftRfq, addToast } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [fileName, setFileName] = useState<string>('IoT_Telemetry_V3_BOM_2026.xlsx');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [matchingProgress, setMatchingProgress] = useState<number>(0);

  // Step 2 Mapping state
  const [mappings, setMappings] = useState({
    mpn: 'Part Number (MPN)',
    manufacturer: 'Mfg Name',
    quantity: 'Qty Required',
    reference: 'Designator / Ref',
    description: 'Component Description',
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
      addToast('BOM Uploaded', `${e.target.files[0].name} loaded for column mapping.`, 'success');
      setCurrentStep(2);
    }
  };

  const handleStartMatching = () => {
    setCurrentStep(4);
    setMatchingProgress(15);
    const interval = setInterval(() => {
      setMatchingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setCurrentStep(5);
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  const handleCreateRfqFromBom = () => {
    addPartToDraftRfq({ mpn: 'LM358DR', manufacturer: 'Texas Instruments', requiredQuantity: 10000 });
    addPartToDraftRfq({ mpn: 'STM32F103C8T6', manufacturer: 'STMicroelectronics', requiredQuantity: 2500 });
    addPartToDraftRfq({ mpn: 'TPS54360D', manufacturer: 'Texas Instruments', requiredQuantity: 2500 });
    addToast('BOM Converted to RFQ', 'All matched line items transferred to custom RFQ draft.', 'success');
    navigateTo('/rfq/new');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Top Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Sourcing Engine</span>
            <span>/</span>
            <span className="text-slate-800 font-medium">BOM Upload & Cross-Match</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Bill of Materials (BOM) Sourcing Assistant
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Upload your multi-line engineering BOM. Automated MPN normalization and stock cross-referencing against Indian verified inventory.
          </p>
        </div>

        {/* 5-Step Process Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 mb-8 shadow-xs">
          <div className="grid grid-cols-5 gap-2 text-center text-xs">
            {[
              { num: 1, title: 'Upload File' },
              { num: 2, title: 'Column Mapping' },
              { num: 3, title: 'Data Preview' },
              { num: 4, title: 'Stock Match' },
              { num: 5, title: 'Sourcing Report' },
            ].map((step) => {
              const isDone = currentStep > step.num;
              const isCurrent = currentStep === step.num;
              return (
                <div key={step.num} className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition-colors ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-blue-600 text-white ring-2 ring-blue-200'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : step.num}
                  </div>
                  <span
                    className={`text-[11px] font-medium hidden sm:block ${
                      isCurrent ? 'text-blue-600 font-semibold' : 'text-slate-500'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 1: Upload */}
        {currentStep === 1 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs text-center">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  setFileName(e.dataTransfer.files[0].name);
                  setCurrentStep(2);
                }
              }}
              className={`border-2 border-dashed rounded-xl p-10 transition-colors ${
                isDragging ? 'border-blue-500 bg-blue-50/50' : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
              }`}
            >
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-200 shadow-xs">
                <UploadCloud className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Drag and Drop your BOM (.xlsx, .xls, .csv)
              </h3>
              <p className="text-xs text-slate-500 mb-6 max-w-sm mx-auto">
                Supports standard CAD / EDA exports from Altium, KiCad, Eagle, or custom procurement Excel sheets.
              </p>

              <label className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs inline-block">
                <span>Browse Files on Computer</span>
                <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} className="hidden" />
              </label>

              <div className="text-[11px] text-slate-400 mt-4">
                Maximum file size: 25 MB • Up to 5,000 line items
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-4">
              <span>Need a standard template?</span>
              <button
                onClick={() => addToast('Template Downloaded', 'Sample OEMInventory_BOM_Template.xlsx saved.', 'info')}
                className="text-blue-600 hover:underline flex items-center gap-1 font-medium"
              >
                <FileText className="w-3.5 h-3.5" /> Download Standard BOM Excel Template
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Column Mapping */}
        {currentStep === 2 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h3 className="font-bold text-base text-slate-900">Step 2: Map BOM Columns</h3>
                <p className="text-xs text-slate-500">File: <strong className="font-mono text-slate-800">{fileName}</strong></p>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                AI Mapping: 98% Confidence
              </span>
            </div>

            <div className="space-y-4 mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <label className="text-xs font-bold text-slate-800">Target Field: Manufacturer Part Number (MPN) *</label>
                  <p className="text-[11px] text-slate-500">Core identifier required for inventory search</p>
                </div>
                <select
                  value={mappings.mpn}
                  onChange={(e) => setMappings({ ...mappings, mpn: e.target.value })}
                  className="text-xs border border-slate-300 rounded-lg p-2 bg-white text-slate-900 font-mono font-medium"
                >
                  <option value="Part Number (MPN)">Column A: "Part Number (MPN)" (Matched)</option>
                  <option value="MFG_PART_NO">Column B: "MFG_PART_NO"</option>
                  <option value="Component Code">Column C: "Component Code"</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <label className="text-xs font-bold text-slate-800">Target Field: Manufacturer Name</label>
                  <p className="text-[11px] text-slate-500">Brand verification (TI, ST, onsemi, Microchip)</p>
                </div>
                <select
                  value={mappings.manufacturer}
                  onChange={(e) => setMappings({ ...mappings, manufacturer: e.target.value })}
                  className="text-xs border border-slate-300 rounded-lg p-2 bg-white text-slate-900 font-medium"
                >
                  <option value="Mfg Name">Column B: "Mfg Name" (Matched)</option>
                  <option value="Vendor">Column D: "Vendor"</option>
                  <option value="Brand">Column E: "Brand"</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <label className="text-xs font-bold text-slate-800">Target Field: Required Quantity *</label>
                  <p className="text-[11px] text-slate-500">Numeric batch volume needed</p>
                </div>
                <select
                  value={mappings.quantity}
                  onChange={(e) => setMappings({ ...mappings, quantity: e.target.value })}
                  className="text-xs border border-slate-300 rounded-lg p-2 bg-white text-slate-900 font-medium"
                >
                  <option value="Qty Required">Column C: "Qty Required" (Matched)</option>
                  <option value="Quantity">Column F: "Quantity"</option>
                  <option value="Per Board Qty">Column G: "Per Board Qty"</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <label className="text-xs font-bold text-slate-800">Target Field: Reference Designator</label>
                  <p className="text-[11px] text-slate-500">e.g., C12, R4, U1, U2 for PCB tracking</p>
                </div>
                <select
                  value={mappings.reference}
                  onChange={(e) => setMappings({ ...mappings, reference: e.target.value })}
                  className="text-xs border border-slate-300 rounded-lg p-2 bg-white text-slate-900 font-medium"
                >
                  <option value="Designator / Ref">Column D: "Designator / Ref" (Matched)</option>
                  <option value="RefDes">Column E: "RefDes"</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Re-upload File
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                Validate & Preview Rows <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Data Import Preview */}
        {currentStep === 3 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h3 className="font-bold text-base text-slate-900">Step 3: Ingestion Validation Preview</h3>
                <p className="text-xs text-slate-500">Checking MPN syntax, duplicate designators, and package standard</p>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                  3 Valid Records
                </span>
                <span className="px-2.5 py-1 rounded bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
                  1 Incomplete Warning
                </span>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg mb-6">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 font-semibold text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Row</th>
                    <th className="py-2.5 px-3">MPN</th>
                    <th className="py-2.5 px-3">Manufacturer</th>
                    <th className="py-2.5 px-3">Quantity</th>
                    <th className="py-2.5 px-3">Ref Designator</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  <tr>
                    <td className="py-2 px-3 text-slate-400">1</td>
                    <td className="py-2 px-3 font-bold text-slate-900">LM358DR</td>
                    <td className="py-2 px-3 text-slate-700 font-sans">Texas Instruments</td>
                    <td className="py-2 px-3 text-slate-900 font-bold">10,000</td>
                    <td className="py-2 px-3 text-slate-500">U1, U2, U4, U5</td>
                    <td className="py-2 px-3">
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-sans font-medium">
                        Valid MPN
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-slate-400">2</td>
                    <td className="py-2 px-3 font-bold text-slate-900">STM32F103C8T6</td>
                    <td className="py-2 px-3 text-slate-700 font-sans">STMicroelectronics</td>
                    <td className="py-2 px-3 text-slate-900 font-bold">2,500</td>
                    <td className="py-2 px-3 text-slate-500">U3</td>
                    <td className="py-2 px-3">
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-sans font-medium">
                        Valid MPN
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-slate-400">3</td>
                    <td className="py-2 px-3 font-bold text-slate-900">TPS54360D</td>
                    <td className="py-2 px-3 text-slate-700 font-sans">Texas Instruments</td>
                    <td className="py-2 px-3 text-slate-900 font-bold">2,500</td>
                    <td className="py-2 px-3 text-slate-500">U6</td>
                    <td className="py-2 px-3">
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-sans font-medium">
                        Valid MPN
                      </span>
                    </td>
                  </tr>
                  <tr className="bg-amber-50/50">
                    <td className="py-2 px-3 text-slate-400">4</td>
                    <td className="py-2 px-3 font-bold text-amber-900">CAP-0.1UF-0603</td>
                    <td className="py-2 px-3 text-amber-700 font-sans">Generic / Unassigned</td>
                    <td className="py-2 px-3 text-slate-900 font-bold">20,000</td>
                    <td className="py-2 px-3 text-slate-500">C1-C20</td>
                    <td className="py-2 px-3">
                      <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-[10px] font-sans font-medium">
                        Generic Part Code (Needs MPN)
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Mapping
              </button>
              <button
                onClick={handleStartMatching}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                Match with Indian Inventory Hubs <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Matching Progress */}
        {currentStep === 4 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
            <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">Cross-Referencing Verified Domestic Stock</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
              Scanning 140,000+ ready stock records across franchised distributors and Tier-1 EMS excess lots in Bangalore, Pune, and Delhi NCR.
            </p>

            <div className="max-w-md mx-auto bg-slate-100 rounded-full h-2.5 overflow-hidden mb-2">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${matchingProgress}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-blue-600">{matchingProgress}% Completed</span>
          </div>
        )}

        {/* Step 5: BOM Sourcing Report */}
        {currentStep === 5 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  BOM Audit Complete
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-1">BOM Sourcing & Coverage Report</h2>
                <p className="text-xs text-slate-500">Project: {fileName}</p>
              </div>

              {/* Coverage Gauge */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center sm:w-48 shrink-0">
                <div className="text-[11px] text-emerald-800 font-semibold">Immediate Stock Coverage</div>
                <div className="text-3xl font-extrabold font-mono text-emerald-700 mt-0.5">85.4%</div>
                <div className="text-[10px] text-emerald-700">3 of 4 Lines Matched in India</div>
              </div>
            </div>

            {/* Coverage Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500">100% Ready Stock</span>
                <div className="text-lg font-bold text-slate-900 mt-0.5">2 Lines</div>
                <span className="text-[11px] text-emerald-600 font-medium">LM358DR, STM32F103C8T6</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500">Partial / Multiple Lots</span>
                <div className="text-lg font-bold text-slate-900 mt-0.5">1 Line</div>
                <span className="text-[11px] text-amber-600 font-medium">TPS54360D (2 Suppliers)</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500">Unmatched / Specific MPN Needed</span>
                <div className="text-lg font-bold text-slate-900 mt-0.5">1 Line</div>
                <span className="text-[11px] text-rose-600 font-medium">Generic 0.1uF Capacitor</span>
              </div>
            </div>

            {/* Actions CTA */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
              >
                Upload Another BOM
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateTo('/global-sourcing')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Source Unmatched Parts Globally
                </button>
                <button
                  onClick={handleCreateRfqFromBom}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  Create RFQ for Matched Items <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
