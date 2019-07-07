import { Cat } from "../shared/models/cat.model";

export class AddCat {
  static readonly type = '[Cat] Add';

  constructor(public payload: Cat) {
  }
}

export class GetCats {
  static readonly type = '[Cat] Get';
}

export class UpdateCat {
  static readonly type = '[Cat] Update';

  constructor(public payload: Cat) {
  }
}

export class DeleteCat {
  static readonly type = '[Cat] Delete';

  constructor(public payload: Cat) {
  }
}

export class SetSelectedCat {
  static readonly type = '[Cat] Set';

  constructor(public payload: Cat) {
  }
}
