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
  addCat({ getState, patchState }: StateContext<CatStateModel>, { payload }: catActions.AddCat) {
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


  @Action(catActions.UpdateCat)
  updateTodo({ getState, setState }: StateContext<CatStateModel>, { payload }: catActions.UpdateCat) {
    return this.catService.editCat(payload)
      .pipe(tap((result) => {
        const state = getState();
        const catsList = [...state.cats];
        const todoIndex = catsList.findIndex(item => item._id === payload._id);
        catsList[todoIndex] = payload;
        setState({
          ...state,
          cats: catsList,
        });
      }));
  }


  @Action(catActions.DeleteCat)
  deleteTodo({ getState, setState }: StateContext<CatStateModel>, { payload }: catActions.DeleteCat) {
    return this.catService.deleteCat(payload).pipe(tap(() => {
      const state = getState();
      const filteredArray = state.cats.filter(item => item._id !== payload._id);
      setState({
        ...state,
        cats: filteredArray,
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
