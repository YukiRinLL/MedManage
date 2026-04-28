package com.medmanage.entity;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "patient_schedule_info")
public class PatientScheduleInfo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "crb_state")
    private String crbState;
    
    @Column(name = "flag")
    private String flag;
    
    @Column(name = "pbjl_count")
    private String pbjlCount;
    
    @Column(name = "pbjl_mon_count")
    private String pbjlMonCount;
    
    @Column(name = "tx_add")
    private String txAdd;
    
    @Column(name = "tx_age")
    private String txAge;
    
    @Column(name = "tx_bed_number")
    private String txBedNumber;
    
    @Column(name = "tx_bing_qu")
    private String txBingQu;
    
    @Column(name = "tx_bxfs")
    private String txBxfs;
    
    @Column(name = "tx_comment")
    private String txComment;
    
    @Column(name = "tx_crbxx")
    private String txCrbxx;
    
    @Column(name = "tx_first_date")
    private String txFirstDate;
    
    @Column(name = "tx_gtz")
    private String txGtz;
    
    @Column(name = "tx_gzdw")
    private String txGzdw;
    
    @Column(name = "tx_height")
    private String txHeight;
    
    @Column(name = "tx_hyzk")
    private String txHyzk;
    
    @Column(name = "tx_mzid")
    private String txMzid;
    
    @Column(name = "tx_name")
    private String txName;
    
    @Column(name = "tx_num")
    private String txNum;
    
    @Column(name = "tx_number")
    private String txNumber;
    
    @Column(name = "tx_phone")
    private String txPhone;
    
    @Column(name = "tx_sex")
    private String txSex;
    
    @Column(name = "tx_state")
    private Integer txState;
    
    @Column(name = "tx_xue_xing")
    private String txXueXing;
    
    @Column(name = "tx_xue_xing_rh")
    private String txXueXingRh;
    
    @Column(name = "tx_ybno")
    private String txYbno;
    
    @Column(name = "tx_youdaoqi")
    private String txYoudaoqi;
    
    @Column(name = "tx_zjlx")
    private String txZjlx;
    
    @Column(name = "tx_zjno")
    private String txZjno;
    
    @Column(name = "tx_zyid")
    private String txZyid;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public PatientScheduleInfo() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCrbState() {
        return crbState;
    }

    public void setCrbState(String crbState) {
        this.crbState = crbState;
    }

    public String getFlag() {
        return flag;
    }

    public void setFlag(String flag) {
        this.flag = flag;
    }

    public String getPbjlCount() {
        return pbjlCount;
    }

    public void setPbjlCount(String pbjlCount) {
        this.pbjlCount = pbjlCount;
    }

    public String getPbjlMonCount() {
        return pbjlMonCount;
    }

    public void setPbjlMonCount(String pbjlMonCount) {
        this.pbjlMonCount = pbjlMonCount;
    }

    public String getTxAdd() {
        return txAdd;
    }

    public void setTxAdd(String txAdd) {
        this.txAdd = txAdd;
    }

    public String getTxAge() {
        return txAge;
    }

    public void setTxAge(String txAge) {
        this.txAge = txAge;
    }

    public String getTxBedNumber() {
        return txBedNumber;
    }

    public void setTxBedNumber(String txBedNumber) {
        this.txBedNumber = txBedNumber;
    }

    public String getTxBingQu() {
        return txBingQu;
    }

    public void setTxBingQu(String txBingQu) {
        this.txBingQu = txBingQu;
    }

    public String getTxBxfs() {
        return txBxfs;
    }

    public void setTxBxfs(String txBxfs) {
        this.txBxfs = txBxfs;
    }

    public String getTxComment() {
        return txComment;
    }

    public void setTxComment(String txComment) {
        this.txComment = txComment;
    }

    public String getTxCrbxx() {
        return txCrbxx;
    }

    public void setTxCrbxx(String txCrbxx) {
        this.txCrbxx = txCrbxx;
    }

    public String getTxFirstDate() {
        return txFirstDate;
    }

    public void setTxFirstDate(String txFirstDate) {
        this.txFirstDate = txFirstDate;
    }

    public String getTxGtz() {
        return txGtz;
    }

    public void setTxGtz(String txGtz) {
        this.txGtz = txGtz;
    }

    public String getTxGzdw() {
        return txGzdw;
    }

    public void setTxGzdw(String txGzdw) {
        this.txGzdw = txGzdw;
    }

    public String getTxHeight() {
        return txHeight;
    }

    public void setTxHeight(String txHeight) {
        this.txHeight = txHeight;
    }

    public String getTxHyzk() {
        return txHyzk;
    }

    public void setTxHyzk(String txHyzk) {
        this.txHyzk = txHyzk;
    }

    public String getTxMzid() {
        return txMzid;
    }

    public void setTxMzid(String txMzid) {
        this.txMzid = txMzid;
    }

    public String getTxName() {
        return txName;
    }

    public void setTxName(String txName) {
        this.txName = txName;
    }

    public String getTxNum() {
        return txNum;
    }

    public void setTxNum(String txNum) {
        this.txNum = txNum;
    }

    public String getTxNumber() {
        return txNumber;
    }

    public void setTxNumber(String txNumber) {
        this.txNumber = txNumber;
    }

    public String getTxPhone() {
        return txPhone;
    }

    public void setTxPhone(String txPhone) {
        this.txPhone = txPhone;
    }

    public String getTxSex() {
        return txSex;
    }

    public void setTxSex(String txSex) {
        this.txSex = txSex;
    }

    public Integer getTxState() {
        return txState;
    }

    public void setTxState(Integer txState) {
        this.txState = txState;
    }

    public String getTxXueXing() {
        return txXueXing;
    }

    public void setTxXueXing(String txXueXing) {
        this.txXueXing = txXueXing;
    }

    public String getTxXueXingRh() {
        return txXueXingRh;
    }

    public void setTxXueXingRh(String txXueXingRh) {
        this.txXueXingRh = txXueXingRh;
    }

    public String getTxYbno() {
        return txYbno;
    }

    public void setTxYbno(String txYbno) {
        this.txYbno = txYbno;
    }

    public String getTxYoudaoqi() {
        return txYoudaoqi;
    }

    public void setTxYoudaoqi(String txYoudaoqi) {
        this.txYoudaoqi = txYoudaoqi;
    }

    public String getTxZjlx() {
        return txZjlx;
    }

    public void setTxZjlx(String txZjlx) {
        this.txZjlx = txZjlx;
    }

    public String getTxZjno() {
        return txZjno;
    }

    public void setTxZjno(String txZjno) {
        this.txZjno = txZjno;
    }

    public String getTxZyid() {
        return txZyid;
    }

    public void setTxZyid(String txZyid) {
        this.txZyid = txZyid;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}