import { State, Selector, Action, StateContext } from '@ngxs/store';
import { CatService } from '../services/cat.service';
import { Cat } from '../shared/models/cat.model';
import { tap } from 'rxjs/internal/operators';
import * as catActions from './cat.actions';

export interface CatStateModel {
  cats: Cat[];
  selectedCat: Cat;
}

@State<CatStateModel>({
  name: 'cats',
  defaults: {
    cats: [],
    selectedCat: null,
  }
})
export class CatState {
  constructor(private catService: CatService) {
  }

  @Selector()
  static getCatsList(state: CatStateModel) {
    return state.cats;
  }

  @Action(catActions.AddCat)
  addCat({ getState, patchState }: StateContext<CatStateModel>, { payload }: Cat) {
    return this.catService.addCat(payload)
      .pipe(tap((result) => {
        const state = getState();
        patchState({
          cats: [...state.cats, result]
        });
      }));
  }

  @Action(catActions.GetCats)
  getCats({ getState, setState }: StateContext<CatStateModel>) {
    return this.catService.getCats()
      .pipe(tap((result) => {
        const state = getState();
        setState({
          ...state,
          cats: result,
        });
      }));
  }

  /*  @Selector()
    static zebraFeed(state: ZooStateModel) {
      return state.zebraFeed;
    }
    @Action(GetCats)
    getTodos({getState, setState}: StateContext<CatStateModel>) {
      return this.catService.getCats().pipe(tap((result) => {
        const state = getState();
        setState({
          ...state,
          cats: result,
        });
      }));
    }
    @Action(FeedZebra)
    feedZebra(ctx: StateContext<ZooStateModel>, action: FeedZebra) {
      return this.zooService.feedZebra(action.zebraName, action.hayAmount).pipe(
        tap(() => ctx.setState({ zebraName: action.zebraName, zebraFeed: true }))
      );
    }*/
}
