export interface ActionPayload {
    method: string;
    url?: string;
    selector?: string;
    value?: string | number;
    dynamicValue?: boolean;
    field?: string;
  }