export interface VerifiedBreach {
  name: string;
  title: string;
  domain: string;
  breachDate: Date;
  addedDate: Date;
  modifiedDate: Date;
  pwnCount: number;
  description: string;
  logoPath: string;
  dataClasses: string[];
  isVerified: boolean;
}