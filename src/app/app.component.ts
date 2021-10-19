import { AppService } from './app.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Users } from './users';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  userForm: FormGroup;
  sortDirection = 1;
  searchBy: string = '';
  loading: boolean = false;
  currentSort: string = '';
  userList: Users[] = [];
  selectedUser: Users = {
    _id: '',
    name: '',
    email: '',
    gender: '',
    state: '',
    city: '',
    isOpen: false,
  };
  isSearching: boolean = false;
  found: Users[] = [];
  isAddUser: boolean = false;
  isEditingUser: boolean = false;
  isSearchUser: boolean = false;
  isModalOpen: boolean = false;
  toggleViews(view: number) {
    if (view === 0) {
      this.isAddUser = !this.isAddUser;
      this.isSearchUser = false;
    } else if (view === 1) {
      this.isAddUser = false;
      this.isSearchUser = !this.isSearchUser;
    }
  }
  constructor(private fb: FormBuilder, private appService: AppService) {
    this.userForm = this.fb.group({
      fname: ['', Validators.required],
      lname: [''],
      gender: [
        'Male',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z ]+$'),
        ]),
      ],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      state: ['', Validators.required],
      city: ['', Validators.required],
    });
    this.fetchUsers();
  }

  searchUser() {
    this.isSearching = true;
    this.found = this.userList.filter((user) =>
      user.name.includes(this.searchBy)
    );
  }

  resetEdit() {
    this.selectedUser = {
      _id: '',
      name: '',
      email: '',
      gender: '',
      state: '',
      city: '',
      isOpen: false,
    };
    this.userForm.reset();
    this.userForm.setValue({ gender: 'Male' });
    this.isAddUser = false;
    this.isEditingUser = false;
  }

  deleteUser(user: Users) {
    this.appService.httpRequest('delete', `accounts/${user._id}`)?.subscribe(
      (res) => {
        this.userList = this.userList.filter((x) => x._id !== user._id);
      },
      (err) => {
        alert('Something Went Wrong');
      }
    );
  }

  submitUser() {
    let data = {
      name: `${this.userForm.value.fname} ${this.userForm.value.lname || ''}`,
      gender: this.userForm.value.gender,
      email: this.userForm.value.email,
      state: this.userForm.value.state,
      city: this.userForm.value.city,
    };
    let url = 'accounts';
    let req: 'post' | 'put' = 'post';
    if (this.selectedUser._id) {
      req = 'put';
      url += `/${this.selectedUser._id}`;
    }
    this.appService.httpRequest(req, url, data)?.subscribe(
      (res: any) => {
        this.isModalOpen = true;
        if (this.selectedUser._id) {
          let index = this.userList.findIndex(
            (user) => user._id == this.selectedUser._id
          );
          this.userList[index].name = data.name;
          this.userList[index].gender = data.gender;
          this.userList[index].email = data.email;
          this.userList[index].state = data.state;
          this.userList[index].city = data.city;
        } else {
          this.userList.push(res);
        }
      },
      (err) => {
        alert('Something Went Wrong');
      }
    );
  }

  setEdit(user: Users) {
    this.userForm.setValue({
      fname: user.name.split(' ')[0],
      lname: user.name.split(' ')[1] || null,
      gender: user.gender,
      state: user.state,
      city: user.city,
      email: user.email,
    });
    window.scroll(0, 0);
    this.isEditingUser = true;
    this.selectedUser = user;
  }

  fetchUsers() {
    this.loading = true;
    this.appService.httpRequest('get', 'accounts')?.subscribe(
      (res: any) => {
        this.loading = false;
        this.userList = res;
      },
      (err) => {
        this.loading = false;
        alert('Something Went Wrong');
      }
    );
  }

  sortBy(by: 'name' | 'email' | 'gender' | 'state' | 'city') {
    this.sortDirection = -this.sortDirection;
    this.currentSort = by;
    this.userList.map((x) => (x.isOpen = false));
    this.userList.sort((a, b) => {
      return a[by] > b[by]
        ? -this.sortDirection
        : b[by] > a[by]
        ? this.sortDirection
        : 0;
    });
  }
}
