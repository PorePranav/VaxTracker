export interface UserDetails {
  name: string;
  email: string;
  role?: string;
  location?: string;
}

export interface Vaccine {
  administration_age: string | null;
  id: string;
  importance: string | null;
  protects_against: string | null;
  name: string;
  side_effects: string | null;
  img_url: string;
}
