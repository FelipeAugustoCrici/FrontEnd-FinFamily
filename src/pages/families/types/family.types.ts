export interface FamilyMember {
  id: string;
  name: string;
}

export interface Family {
  id: string;
  name: string;
  description?: string;
  members?: FamilyMember[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFamilyDTO {
  name: string;
  description?: string;
}

export interface UpdateFamilyDTO {
  name?: string;
  description?: string;
}
