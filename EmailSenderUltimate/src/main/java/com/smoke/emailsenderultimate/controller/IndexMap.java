package com.smoke.emailsenderultimate.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class IndexMap {
    @RequestMapping("/")
    public String index(){
        return "index.html";
    }
}
