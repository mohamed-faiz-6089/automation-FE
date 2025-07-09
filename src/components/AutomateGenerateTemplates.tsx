import React, { useState, useCallback, useMemo, useEffect, ChangeEvent } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { fetchMethods, sendAutomationData } from '../services/automateService';
import type { ActionPayload } from '../types';

/* Types */
type Action = {
  id: string;
  method: string;
  url: string;
  selector: string;
  value: string | number;
  enableDynamicValue: boolean;
  dynamicValue: boolean;
};

const BLANK_ACTION: Omit<Action, 'id'> = {
  method: '',
  url: '',
  selector: '',
  value: '',
  enableDynamicValue: false,
  dynamicValue: true,
};

const uuid = () => crypto.randomUUID?.() ?? String(Date.now() + Math.random());

const methodNeedsSelector = (m: string) =>
  ['fillInput', 'clickElement', 'selectDropdown', 'selectAutocompleteOption', 'clickElementByText'].includes(m);
const methodNeedsValue = (m: string) =>
  ['fillInput', 'selectDropdown', 'selectAutocompleteOption'].includes(m);

const AutomateGenerateTemplate: React.FC = () => {
  const [title, setTitle] = useState('');
  const [actions, setActions] = useState<Action[]>([]);
  const [methodOptions, setMethodOptions] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMethods().then(setMethodOptions).catch(console.error);
  }, []);

  const addAction = useCallback(() => {
    setActions((prev) => [...prev, { id: uuid(), ...BLANK_ACTION }]);
  }, []);

  const removeAction = useCallback((index: number) => {
    setActions((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateField = useCallback(
    <K extends keyof Action>(index: number, key: K, value: Action[K]) => {
      setActions((prev) =>
        prev.map((a, i) => (i === index ? { ...a, [key]: value } : a)),
      );
    },
    [],
  );

  const cleanedActions: ActionPayload[] = useMemo(
    () =>
      actions.map(({ enableDynamicValue, id, ...rest }) => {
        if (!enableDynamicValue) delete rest.dynamicValue;
        Object.keys(rest).forEach((k) => {
          const v = (rest as any)[k];
          if (v === '' || v === null || v === undefined) delete (rest as any)[k];
        });
        return rest as unknown as ActionPayload;
      }),
    [actions],
  );

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await sendAutomationData(cleanedActions);
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(actions);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setActions(reordered);
  };

  return (
    <div className="min-vw-100 min-vh-100  container p-5">
      <h2 className="text-center ">Generate Template</h2>

      <div className="mb-3">
        <label className="form-label fw-semibold">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-control"
        />
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="actions">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {actions.map((action, index) => (
                <Draggable draggableId={action.id} index={index} key={action.id}>
                  {(provided) => (
                    <div
                      className="card p-3 mb-3 shadow-sm"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div className="mb-2">
                        <label className="form-label">Method</label>
                        <select
                          className="form-select"
                          value={action.method}
                          onChange={(e) => updateField(index, 'method', e.target.value)}
                        >
                          <option value="">Select</option>
                          {methodOptions.map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                        </select>
                      </div>

                      {action.method === 'gotoPage' && (
                        <div className="mb-2">
                          <label className="form-label">URL</label>
                          <input
                            type="text"
                            className="form-control"
                            value={action.url}
                            onChange={(e) => updateField(index, 'url', e.target.value)}
                          />
                        </div>
                      )}

                      {methodNeedsSelector(action.method) && (
                        <div className="mb-2">
                          <label className="form-label">Selector</label>
                          <input
                            type="text"
                            className="form-control"
                            value={action.selector}
                            onChange={(e) => updateField(index, 'selector', e.target.value)}
                          />
                        </div>
                      )}

                      {methodNeedsValue(action.method) && (
                        <div className="mb-2">
                          <label className="form-label">Value</label>
                          <input
                            type="text"
                            className="form-control"
                            value={action.value.toString()}
                            onChange={(e) => updateField(index, 'value', e.target.value)}
                          />
                        </div>
                      )}

                      {action.method === 'explicitWait' && (
                        <div className="mb-2">
                          <label className="form-label">Wait Time (ms)</label>
                          <input
                            type="number"
                            className="form-control"
                            value={action.value.toString()}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              updateField(index, 'value', Number(e.target.value))
                            }
                          />
                        </div>
                      )}

                      <div className="form-check form-switch mb-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={action.enableDynamicValue}
                          onChange={(e) => updateField(index, 'enableDynamicValue', e.target.checked)}
                        />
                        <label className="form-check-label">Enable Dynamic Value</label>
                      </div>

                      {action.enableDynamicValue && (
                        <div className="mb-2">
                          <label className="form-label">Dynamic Value</label>
                          <select
                            className="form-select"
                            value={action.dynamicValue.toString()}
                            onChange={(e) =>
                              updateField(index, 'dynamicValue', e.target.value === 'true')
                            }
                          >
                            <option value="true">True</option>
                            <option value="false">False</option>
                          </select>
                        </div>
                      )}

                      <button
                        onClick={() => removeAction(index)}
                        className="btn btn-outline-danger btn-sm"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <button onClick={addAction} className="btn btn-primary me-2">
        Add Action
      </button>
      <button onClick={handleSubmit} className="btn btn-success" disabled={submitting}>
        {submitting ? 'Submitting…' : 'Submit'}
      </button>

      <pre className="mt-4">{JSON.stringify(cleanedActions, null, 2)}</pre>
    </div>
  );
};

export default AutomateGenerateTemplate;
