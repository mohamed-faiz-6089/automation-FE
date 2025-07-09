import React, { useState, useCallback, useMemo, useEffect, ChangeEvent } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { fetchMethods, sendAutomationData, saveScript, updateScript, loadScript } from '../services/automateService';
import { useAutoSave } from '../hooks/useAutoSave';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export type Action = {
  id: string;
  method: string;
  url?: string;
  selector?: string;
  value?: string | number;
  enableDynamicValue: boolean;
  dynamicValue: boolean;
  timeout?: number;
};

const BLANK_ACTION: Omit<Action, 'id'> = {
  method: '',
  url: '',
  selector: '',
  value: '',
  enableDynamicValue: false,
  dynamicValue: true,
  timeout: 30000,
};

const uuid = () => crypto.randomUUID?.() ?? String(Date.now() + Math.random());
const needsSel = (m: string) => ['fillInput', 'clickElement', 'selectDropdown', 'selectAutocompleteOption', 'clickElementByText'].includes(m);
const needsVal = (m: string) => ['fillInput', 'selectDropdown', 'selectAutocompleteOption', 'clickElementByText'].includes(m);

interface Props { scriptId?: string; }
const AutomateEditor: React.FC<Props> = ({ scriptId }) => {
  const [title, setTitle] = useState('');
  const [actions, setActions] = useState<Action[]>([]);
  const [methods, setMethods] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [dirty, setDirty] = useState(false);

  /* Load methods & existing script */
  useEffect(() => {
    fetchMethods().then(setMethods);
    if (scriptId) {
      loadScript(scriptId).then((s) => {
        setTitle(s.title);
        setActions(s.actions);
      });
    } else {
      // preload draft
      const draft = localStorage.getItem('draft-script');
      if (draft) {
        const json = JSON.parse(draft);
        setTitle(json.title ?? '');
        setActions(json.actions ?? []);
      }
    }
  }, [scriptId]);

  // autosave draft when no scriptId yet
  useAutoSave('draft-script', { title, actions });

  const addAction = useCallback((idx?: number) => {
    setDirty(true);
    setActions((prev) => {
      const clone = [...prev];
      const newOne = { id: uuid(), ...BLANK_ACTION };
      if (idx === undefined) clone.push(newOne);
      else clone.splice(idx, 0, newOne);
      return clone;
    });
  }, []);

  const removeAction = useCallback((index: number) => {
    setDirty(true);
    setActions((p) => p.filter((_, i) => i !== index));
  }, []);

  const cloneAction = useCallback((index: number) => {
    setDirty(true);
    setActions((p) => {
      const clone = [...p];
      clone.splice(index + 1, 0, { ...p[index], id: uuid() });
      return clone;
    });
  }, []);

  const updateField = useCallback(<K extends keyof Action>(i: number, k: K, v: Action[K]) => {
    setDirty(true);
    setActions((p) => p.map((a, idx) => (idx === i ? { ...a, [k]: v } : a)));
  }, []);

  const cleaned = useMemo(() =>
    actions.map(({ id, enableDynamicValue, ...rest }) => {
      if (!enableDynamicValue) rest.dynamicValue = false;
      Object.entries(rest).forEach(([k, v]) => {
        if (v === '' || v === null || v === undefined) delete (rest as any)[k];
      });
      return rest;
    }),
  [actions]);

  const save = async () => {
    if (!title.trim()) return toast.error('Title is required');
    if (scriptId) {
      await updateScript(scriptId, { title, actions });
      setDirty(false);
      toast.success('Script updated');
    } else {
      const { id } = await saveScript({ title, actions });
      toast.success('Script saved');
      // you may want to navigate to /edit/:id here
    }
  };

  const run = async () => {
    setSubmitting(true);
    try {
      await sendAutomationData(cleaned);
      toast.success('Run started');
    } catch (e: any) {
      toast.error(`Run error: ${e.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const onDragEnd = (res: DropResult) => {
    if (!res.destination) return;
    setActions((list) => {
      const reordered = [...list];
      const [moved] = reordered.splice(res.source.index, 1);
      reordered.splice(res.destination.index, 0, moved);
      return reordered;
    });
    setDirty(true);
  };

  /* JSX */
  return (
    <div className="min-vh-100 min-vw-100 d-flex flex-column bg-gradient bg-body-tertiary">
      <ToastContainer position="bottom-right" />

      {/* Header */}
      <header className="py-3 px-4 border-bottom flex-shrink-0">
        <div className="d-flex align-items-end justify-content-between">
          <div style={{ width: '60%' }}>
            <label className="form-label fw-semibold mb-1">Title</label>
            <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <button className="btn btn-outline-secondary me-2" onClick={save} disabled={!dirty}>💾 Save</button>
            <button className="btn btn-success" onClick={run} disabled={submitting}>{submitting ? 'Running…' : '▶ Run'}</button>
          </div>
        </div>
      </header>

      {/* Main list */}
      <main className="flex-grow-1 overflow-auto px-4 py-3">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="actions">
            {(prov) => (
              <div ref={prov.innerRef} {...prov.droppableProps}>
                {actions.map((a, idx) => (
                  <Draggable key={a.id} draggableId={a.id} index={idx}>
                    {(prov) => (
                      <div ref={prov.innerRef} {...prov.draggableProps} className="card mb-3 shadow-sm">
                        <div className="card-header d-flex justify-content-between align-items-center" {...prov.dragHandleProps}>
                          <span>Step {idx + 1}</span>
                          <div>
                            <button className="btn btn-sm btn-light me-1" title="Clone" onClick={() => cloneAction(idx)}>⧉</button>
                            <button className="btn btn-sm btn-light me-1" title="Insert below" onClick={() => addAction(idx + 1)}>＋</button>
                            <button className="btn btn-sm btn-outline-danger" title="Remove" onClick={() => removeAction(idx)}>✕</button>
                          </div>
                        </div>
                        <div className="card-body">
                          {/* Method */}
                          <div className="mb-2">
                            <label className="form-label">Method</label>
                            <select className="form-select" value={a.method} onChange={(e) => updateField(idx, 'method', e.target.value)}>
                              <option value="">Select</option>
                              {methods.map((m) => <option key={m} value={m}>{m}</option>)}
                            </select>
                          </div>

                          {a.method === 'gotoPage' && (
                            <InputField label="URL" value={a.url} onChange={(v) => updateField(idx, 'url', v)} />
                          )}

                          {needsSel(a.method) && (
                            <InputField label="Selector" value={a.selector} onChange={(v) => updateField(idx, 'selector', v)} placeholder="css:, id:, class:, xpath:" />
                          )}

                          {needsVal(a.method) && (
                            <InputField label="Value" value={String(a.value ?? '')} onChange={(v) => updateField(idx, 'value', v)} />
                          )}

                          {a.method === 'explicitWait' && (
                            <InputField type="number" label="Wait (ms)" value={String(a.value ?? '')} onChange={(v) => updateField(idx, 'value', Number(v))} />
                          )}

                          {/* Dynamic toggle */}
                          <div className="form-check form-switch mb-2">
                            <input className="form-check-input" type="checkbox" checked={a.enableDynamicValue} onChange={(e) => updateField(idx, 'enableDynamicValue', e.target.checked)} />
                            <label className="form-check-label">Enable Dynamic Value</label>
                          </div>

                          {a.enableDynamicValue && (
                            <select className="form-select mb-2" value={a.dynamicValue.toString()} onChange={(e) => updateField(idx, 'dynamicValue', e.target.value === 'true')}>
                              <option value="true">True</option>
                              <option value="false">False</option>
                            </select>
                          )}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {prov.placeholder}
                {/* add‑action button at end */}
                <button className="btn btn-primary w-100" onClick={() => addAction()}>＋ Add Step</button>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </main>

      {/* Dev preview */}
      <pre className="m-0 p-3 bg-dark text-white small" style={{ maxHeight: 200, overflowY: 'auto' }}>{JSON.stringify(cleaned, null, 2)}</pre>
    </div>
  );
};

/* Helper input component */
interface FieldProps { label: string; value: any; onChange: (v: string) => void; type?: string; placeholder?: string; }
const InputField: React.FC<FieldProps> = ({ label, value, onChange, type = 'text', placeholder }) => (
  <div className="mb-2">
    <label className="form-label">{label}</label>
    <input type={type} className="form-control" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
  </div>
);

export default AutomateEditor;