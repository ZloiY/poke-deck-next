type FlipState = "Preview" | "Details";

type User = {
  id: string;
  name: string;
  numberOfDecks: number;
};

type CreateDeckParams = {
  name: string;
  private: boolean;
};

type Message = {
  id: string;
  state: "Success" | "Failure";
  message: string;
};

type PaginationState = "Initial" | "Next" | "Prev";
