package com.medmanage.entity;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "dialysis_schedule")
public class DialysisSchedule {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "tx_txj_id")
    private String txTxjId;
    
    @Column(name = "tx_pdrq")
    private String txPdrq;
    
    @Column(name = "tx_pdrq_type")
    private Integer txPdrqType;
    
    @Column(name = "number")
    private String number;
    
    @Column(name = "tx_txfs_id")
    private Integer txTxfsId;
    
    @Column(name = "tx_is_permanent")
    private Integer txIsPermanent;
    
    @Column(name = "tx_is_pause")
    private Integer txIsPause;
    
    @Column(name = "tx_txfs_alias")
    private String txTxfsAlias;
    
    @Column(name = "tx_txfsbm")
    private String txTxfsbm;
    
    @Column(name = "week")
    private Integer week;
    
    @Column(name = "name")
    private String name;
    
    @Column(name = "tx_info")
    private String txInfo;
    
    @Column(name = "tx_xtcf")
    private String txXtcf;
    
    @Column(name = "tx_zljh")
    private String txZljh;
    
    @Column(name = "tx_txq_id")
    private String txTxqId;
    
    @Column(name = "tx_jhq_id")
    private String txJhqId;
    
    @Column(name = "tx_glq_id")
    private String txGlqId;
    
    @Column(name = "tx_xgtl_id")
    private String txXgtlId;
    
    @Column(name = "tx_txq")
    private String txTxq;
    
    @Column(name = "tx_device_sequence")
    private String txDeviceSequence;
    
    @Column(name = "tx_status")
    private Integer txStatus;
    
    @Column(name = "tx_crbxx")
    private String txCrbxx;
    
    @Column(name = "tx_jtstatus")
    private String txJtstatus;
    
    @Column(name = "tx_zlms")
    private String txZlms;
    
    @Column(name = "tx_userid")
    private String txUserid;
    
    @Column(name = "hz_status")
    private Integer hzStatus;
    
    @Column(name = "tx_zyid")
    private String txZyid;
    
    @Column(name = "tx_mzid")
    private String txMzid;
    
    @Column(name = "tx_comment")
    private String txComment;
    
    @Column(name = "count_fs_id")
    private String countFsId;
    
    @Column(name = "tx_txqj_names_q")
    private String txTxqjNamesQ;
    
    @Column(name = "tx_pg_nlid")
    private String txPgNlid;
    
    @Column(name = "tx_pg_dgid")
    private String txPgDgid;
    
    @Column(name = "tx_pg_zznames")
    private String txPgZznames;
    
    @Column(name = "tx_pg_bfznames")
    private String txPgBfznames;
    
    @Column(name = "tx_pg_th_nlid")
    private String txPgThNlid;
    
    @Column(name = "tx_pg_th_dgid")
    private String txPgThDgid;
    
    @Column(name = "tx_pg_th_zznames")
    private String txPgThZznames;
    
    @Column(name = "tx_pg_th_bfznames")
    private String txPgThBfznames;
    
    @Column(name = "tx_nx_id_h")
    private String txNxIdH;
    
    @Column(name = "crb")
    private String crb;
    
    @Column(name = "tx_txj_ms")
    private String txTxjMs;
    
    @Column(name = "tx_bf_type")
    private String txBfType;
    
    @Column(name = "tx_zjno")
    private String txZjno;
    
    @Column(name = "tx_txpl")
    private String txTxpl;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public DialysisSchedule() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTxTxjId() {
        return txTxjId;
    }

    public void setTxTxjId(String txTxjId) {
        this.txTxjId = txTxjId;
    }

    public String getTxPdrq() {
        return txPdrq;
    }

    public void setTxPdrq(String txPdrq) {
        this.txPdrq = txPdrq;
    }

    public Integer getTxPdrqType() {
        return txPdrqType;
    }

    public void setTxPdrqType(Integer txPdrqType) {
        this.txPdrqType = txPdrqType;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public Integer getTxTxfsId() {
        return txTxfsId;
    }

    public void setTxTxfsId(Integer txTxfsId) {
        this.txTxfsId = txTxfsId;
    }

    public Integer getTxIsPermanent() {
        return txIsPermanent;
    }

    public void setTxIsPermanent(Integer txIsPermanent) {
        this.txIsPermanent = txIsPermanent;
    }

    public Integer getTxIsPause() {
        return txIsPause;
    }

    public void setTxIsPause(Integer txIsPause) {
        this.txIsPause = txIsPause;
    }

    public String getTxTxfsAlias() {
        return txTxfsAlias;
    }

    public void setTxTxfsAlias(String txTxfsAlias) {
        this.txTxfsAlias = txTxfsAlias;
    }

    public String getTxTxfsbm() {
        return txTxfsbm;
    }

    public void setTxTxfsbm(String txTxfsbm) {
        this.txTxfsbm = txTxfsbm;
    }

    public Integer getWeek() {
        return week;
    }

    public void setWeek(Integer week) {
        this.week = week;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTxInfo() {
        return txInfo;
    }

    public void setTxInfo(String txInfo) {
        this.txInfo = txInfo;
    }

    public String getTxXtcf() {
        return txXtcf;
    }

    public void setTxXtcf(String txXtcf) {
        this.txXtcf = txXtcf;
    }

    public String getTxZljh() {
        return txZljh;
    }

    public void setTxZljh(String txZljh) {
        this.txZljh = txZljh;
    }

    public String getTxTxqId() {
        return txTxqId;
    }

    public void setTxTxqId(String txTxqId) {
        this.txTxqId = txTxqId;
    }

    public String getTxJhqId() {
        return txJhqId;
    }

    public void setTxJhqId(String txJhqId) {
        this.txJhqId = txJhqId;
    }

    public String getTxGlqId() {
        return txGlqId;
    }

    public void setTxGlqId(String txGlqId) {
        this.txGlqId = txGlqId;
    }

    public String getTxXgtlId() {
        return txXgtlId;
    }

    public void setTxXgtlId(String txXgtlId) {
        this.txXgtlId = txXgtlId;
    }

    public String getTxTxq() {
        return txTxq;
    }

    public void setTxTxq(String txTxq) {
        this.txTxq = txTxq;
    }

    public String getTxDeviceSequence() {
        return txDeviceSequence;
    }

    public void setTxDeviceSequence(String txDeviceSequence) {
        this.txDeviceSequence = txDeviceSequence;
    }

    public Integer getTxStatus() {
        return txStatus;
    }

    public void setTxStatus(Integer txStatus) {
        this.txStatus = txStatus;
    }

    public String getTxCrbxx() {
        return txCrbxx;
    }

    public void setTxCrbxx(String txCrbxx) {
        this.txCrbxx = txCrbxx;
    }

    public String getTxJtstatus() {
        return txJtstatus;
    }

    public void setTxJtstatus(String txJtstatus) {
        this.txJtstatus = txJtstatus;
    }

    public String getTxZlms() {
        return txZlms;
    }

    public void setTxZlms(String txZlms) {
        this.txZlms = txZlms;
    }

    public String getTxUserid() {
        return txUserid;
    }

    public void setTxUserid(String txUserid) {
        this.txUserid = txUserid;
    }

    public Integer getHzStatus() {
        return hzStatus;
    }

    public void setHzStatus(Integer hzStatus) {
        this.hzStatus = hzStatus;
    }

    public String getTxZyid() {
        return txZyid;
    }

    public void setTxZyid(String txZyid) {
        this.txZyid = txZyid;
    }

    public String getTxMzid() {
        return txMzid;
    }

    public void setTxMzid(String txMzid) {
        this.txMzid = txMzid;
    }

    public String getTxComment() {
        return txComment;
    }

    public void setTxComment(String txComment) {
        this.txComment = txComment;
    }

    public String getCountFsId() {
        return countFsId;
    }

    public void setCountFsId(String countFsId) {
        this.countFsId = countFsId;
    }

    public String getTxTxqjNamesQ() {
        return txTxqjNamesQ;
    }

    public void setTxTxqjNamesQ(String txTxqjNamesQ) {
        this.txTxqjNamesQ = txTxqjNamesQ;
    }

    public String getTxPgNlid() {
        return txPgNlid;
    }

    public void setTxPgNlid(String txPgNlid) {
        this.txPgNlid = txPgNlid;
    }

    public String getTxPgDgid() {
        return txPgDgid;
    }

    public void setTxPgDgid(String txPgDgid) {
        this.txPgDgid = txPgDgid;
    }

    public String getTxPgZznames() {
        return txPgZznames;
    }

    public void setTxPgZznames(String txPgZznames) {
        this.txPgZznames = txPgZznames;
    }

    public String getTxPgBfznames() {
        return txPgBfznames;
    }

    public void setTxPgBfznames(String txPgBfznames) {
        this.txPgBfznames = txPgBfznames;
    }

    public String getTxPgThNlid() {
        return txPgThNlid;
    }

    public void setTxPgThNlid(String txPgThNlid) {
        this.txPgThNlid = txPgThNlid;
    }

    public String getTxPgThDgid() {
        return txPgThDgid;
    }

    public void setTxPgThDgid(String txPgThDgid) {
        this.txPgThDgid = txPgThDgid;
    }

    public String getTxPgThZznames() {
        return txPgThZznames;
    }

    public void setTxPgThZznames(String txPgThZznames) {
        this.txPgThZznames = txPgThZznames;
    }

    public String getTxPgThBfznames() {
        return txPgThBfznames;
    }

    public void setTxPgThBfznames(String txPgThBfznames) {
        this.txPgThBfznames = txPgThBfznames;
    }

    public String getTxNxIdH() {
        return txNxIdH;
    }

    public void setTxNxIdH(String txNxIdH) {
        this.txNxIdH = txNxIdH;
    }

    public String getCrb() {
        return crb;
    }

    public void setCrb(String crb) {
        this.crb = crb;
    }

    public String getTxTxjMs() {
        return txTxjMs;
    }

    public void setTxTxjMs(String txTxjMs) {
        this.txTxjMs = txTxjMs;
    }

    public String getTxBfType() {
        return txBfType;
    }

    public void setTxBfType(String txBfType) {
        this.txBfType = txBfType;
    }

    public String getTxZjno() {
        return txZjno;
    }

    public void setTxZjno(String txZjno) {
        this.txZjno = txZjno;
    }

    public String getTxTxpl() {
        return txTxpl;
    }

    public void setTxTxpl(String txTxpl) {
        this.txTxpl = txTxpl;
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