import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivateAccountPage } from './activate-account.page';

describe('ActivateAccountPage', () => {
  let component: ActivateAccountPage;
  let fixture: ComponentFixture<ActivateAccountPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivateAccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
