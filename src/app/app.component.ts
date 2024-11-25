import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from "@angular/material/icon"
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { MatButtonModule } from "@angular/material/button"
import { PaymentServiceService } from './services/payment-service.service';
import { MatDatepickerModule } from "@angular/material/datepicker"
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'l', // Exemplo de formato
  },
  display: {
    dateInput: 'l',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-root',
  standalone: true,
  providers: [
    {
      provide: DateAdapter,
      useClass: NativeDateAdapter,
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: MY_DATE_FORMATS,
    },
  ],
  imports: [RouterOutlet, FormsModule, MatIconModule, MatSlideToggleModule, CommonModule, MatInputModule, MatSelectModule, MatButtonModule, MatDatepickerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'PaymentPlannerFront';
  checked = false
  editModal = false
  deleteModal = false

  paymentTypes = null
  payments = null

  paymentId = 0
  formTitle = ""
  formDescription = ""
  formValue = ""
  formExpirationDate = new Date()
  formPaymentTypeId = 1

  createNewPayment = false

  constructor(private paymentService: PaymentServiceService) {}
  
  ngOnInit(): void {
    this.paymentService.getPayments().subscribe({
      next: (data) => {
        this.payments = data
        console.log('payments', this.payments)
      },
      error: (err) => {
        console.error("Erro ao carregar pagamentos", err)
        throw err;
      }
    })

    this.paymentService.getPaymentTypes().subscribe({
      next: (data) => {
        this.paymentTypes = data
        console.log('paymentTypes', this.paymentTypes)
      },
      error: (error) => {
        console.error("Erro ao obter tipos de pagamentos", error)
        throw error;
      }
    })
  }

  openDeleteModal(payment: any = "") {
    this.paymentId = payment.id
    this.deleteModal = !this.deleteModal
  }

  openEditModal(payment: any = "") {

    if (payment === "") {
      this.createNewPayment = true
    } else {
      this.createNewPayment = false
    }

    this.paymentId = payment.id
    this.formTitle = payment.name
    this.formDescription = payment.description
    this.formValue = payment.value
    this.formExpirationDate = payment.expirationDate ? new Date(payment.expirationDate) :  new Date
    this.formPaymentTypeId = payment.paymentTypeId
    this.editModal = !this.editModal
  }

  createPayment() {
    const payment = {
      name: this.formTitle,
      description: this.formDescription,
      value: this.formValue,
      expirationDate: this.formExpirationDate,
      paymentTypeId: this.formPaymentTypeId,
      isActive: true
    }

    this.paymentService.createPayment(payment).subscribe({
      next: (data) => {
        console.log(data)
        this.paymentService.getPayments().subscribe({
          next: (data) => {
            this.payments = data
          }, error: (error) => {
            console.error("Error aos buscar pagamentos")
            throw error;
          } 
        })
        this.editModal = false
      }, error: (err) => {
        console.log(err)
      }
    })

  }

  updatePayment() {
    const payment = {
      id: this.paymentId,
      name: this.formTitle,
      description: this.formDescription,
      value: this.formValue,
      expirationDate: this.formExpirationDate,
      paymentTypeId: this.formPaymentTypeId,
      isActive: true
    }

    this.paymentService.updatePayment(payment.id, payment).subscribe({
      next: (data) => {
        console.log(data)
        this.paymentService.getPayments().subscribe({
          next: (data) => {
            this.payments = data
          }, error: (error) => {
            console.error("Error ao buscar os pagamentos!")
            throw error;
          }
        })
        this.editModal = false
      }, error: (err) => {
        console.log(err)
      }
    })
  }

  deletePayment() {
    this.paymentService.deletePayment(this.paymentId).subscribe({
      next: (data) => {
        console.log(data)
        this.paymentService.getPayments().subscribe({
          next: (data) => {
            this.payments = data
            }, error: (error) => {
                console.error("Error ao buscar os pagamentos!")
                throw error;
            }
        })
        this.deleteModal = false
      }, error: (error) => {
        console.error("Não foi possível deletar o pagamento!")
        throw error
      }
    })
  }

  changeStatePayment(payment: any) {
    const state = !payment.isActive
    this.paymentService.changeStatePayment(payment.id, state).subscribe({
      next: (data) => {
        console.log(data)
      }, error: (error) => {
        console.error("Não foi possível alterar o estado do pagamento!")
        throw error
      }
    })
  }

}
