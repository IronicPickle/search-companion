export interface Property {
  [key: string]: any;
  companyName: string;
  flatNumber: string;
  plotNumber: string;
  developmentName: string;
  developer: string;
  houseName: string;
  houseNumber: string;
  street: string;
  addressLine2: string;
  locality: string;
  town: string;
  county: string;
  postCode: string;
  titleNumber: string;
  uprn: string;
}

export interface Product {
  [key: string]: any;
  name: string;
  returned?: string;
  cost: string;
}

export interface Order {
  [key: string]: any;
  reference: string;
  property: Property;
  products: Product[];
  type: string;
  council: string;
  water: string;
  totalCost: string;
}