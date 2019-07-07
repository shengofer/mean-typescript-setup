import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs/Rx';

import { CatService } from '../services/cat.service';
import { ToastComponent } from '../shared/toast/toast.component';
import { Cat } from '../shared/models/cat.model';
import { CatState } from './cat.state';
import { AddCat, DeleteCat, GetCats, UpdateCat } from './cat.actions';

@Component({
  selector: 'app-cats',
  templateUrl: './cats.component.html',
  styleUrls: ['./cats.component.scss']
})
export class CatsComponent implements OnInit {

  cat = new Cat();
  cats: Cat[] = [];
  isLoading = true;
  isEditing = false;
  @Select(CatState.getCatsList) catsList$: Observable<Cat[]>;
  addCatForm: FormGroup;
  name = new FormControl('', Validators.required);
  age = new FormControl('', Validators.required);
  weight = new FormControl('', Validators.required);

  constructor(private catService: CatService,
              private formBuilder: FormBuilder,
              private store: Store,
              public toast: ToastComponent) {
    this.store.dispatch(new GetCats());
  }

  ngOnInit() {
    this.addCatForm = this.formBuilder.group({
      name: this.name,
      age: this.age,
      weight: this.weight
    });
    this.catsList$
      .subscribe((items) => {
        this.cats = items;
        this.isLoading = false
      })
  }

  getCats() {
    this.catService.getCats().subscribe(
      data => this.cats = data,
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  addCat() {
    this.store.dispatch(new AddCat(this.addCatForm.value))
      .subscribe((item) => {
        this.addCatForm.reset();
        this.toast.setMessage('item added successfully.', 'success');
      });

  }

  enableEditing(cat: Cat) {
    this.isEditing = true;
    this.cat = cat;
  }

  cancelEditing() {
    this.isEditing = false;
    this.cat = new Cat();
    this.toast.setMessage('item editing cancelled.', 'warning');
    // reload the cats to reset the editing
    this.store.dispatch(new GetCats());
  }

  editCat(cat: Cat) {
    this.store.dispatch(new UpdateCat(cat))
      .subscribe((item) => {
        this.isEditing = false;
        this.cat = item;
        this.toast.setMessage('item edited successfully.', 'success');
      });
  }

  deleteCat(cat: Cat) {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      this.store.dispatch(new DeleteCat(cat))
        .subscribe(() => {
          this.toast.setMessage('item deleted successfully.', 'success');
        })
    }
  }

}
