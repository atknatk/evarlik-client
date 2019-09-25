import { AfterViewInit, Component, OnInit } from '@angular/core';

declare const $: any;

@Component({
  templateUrl: './support.component.html'
})
export class SupportComponent implements OnInit, AfterViewInit {
  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    $(function () {

      $("#nav li a").click(function () {
        $("#nav li a").removeClass("anchor_active");
        $(this).addClass("anchor_active");
      });

    });
  }

}
