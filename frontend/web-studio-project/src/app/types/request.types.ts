export enum RequestEnumType {
    order = 'order',
    consultation = 'consultation',
}

export type RequestType = {
  name: string,
  phone: string,
  service?: string,
  type: RequestEnumType,

}
