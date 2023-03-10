type FlipState = 'Preview' | 'Details';

type CreateDeckParams = {
  name: string;
  private: boolean;
};

type Message = {
  id: string,
  state: 'Success' | 'Failure',
  message: string,
}

type PaginationState = "Initial" | "Next" | "Prev";
