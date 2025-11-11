export interface Certification {
  id: string;
  title: string;
  level: 'Basic' | 'Intermediate' | 'Advanced' | 'Cơ bản' | 'Trung cấp' | 'Nâng cao';
  description?: string;
  category: 'role' | 'skill';
  icon: string;
  color?: string;
}

export interface CertificationSection {
  title: string;
  certifications: Certification[];
}
