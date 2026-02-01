
export interface Portal {
  id: string;
  name: string;
  url: string;
  category: 'Local' | 'National' | 'Bio' | 'Tech' | 'Culture' | 'Etc';
  icon: string;
}

export interface Announcement {
  title: string;
  date: string;
  link: string;
  summary?: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}
