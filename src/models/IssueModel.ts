type Author = {
  login: string;
};

export type Issue = {
  id: string;
  number: number;
  title: string;
  body: string;
  createdAt: Date;
  author: Author | null;
};
