package com.smoke.emailsenderultimate.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class EmailController {
    @GetMapping("/email")
    public String email(){
        return "email.html";
    }
}
