import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Protection } from "../models/protection.model";

@Injectable({ providedIn: 'root' })
export class ProtectionService {
    
    constructor(private http: HttpClient) {}

    protectionChanged(body: Protection) {
        return this.http.post('ProtectionApi/Protection/Changed', body);
    }
}