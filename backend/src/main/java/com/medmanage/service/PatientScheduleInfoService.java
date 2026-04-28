package com.medmanage.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.medmanage.entity.PatientScheduleInfo;
import com.medmanage.repository.PatientScheduleInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class PatientScheduleInfoService {
    
    @Autowired
    private PatientScheduleInfoRepository patientScheduleInfoRepository;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    public List<PatientScheduleInfo> getAllPatientInfos() {
        return patientScheduleInfoRepository.findAll();
    }
    
    public PatientScheduleInfo getPatientInfoByNumber(String txNumber) {
        return patientScheduleInfoRepository.findByTxNumber(txNumber).orElse(null);
    }
    
    public PatientScheduleInfo getPatientInfoByZyid(String txZyid) {
        return patientScheduleInfoRepository.findByTxZyid(txZyid).orElse(null);
    }
    
    public List<PatientScheduleInfo> getActivePatients() {
        return patientScheduleInfoRepository.findByTxState(1);
    }
    
    public List<PatientScheduleInfo> searchPatientsByName(String name) {
        return patientScheduleInfoRepository.findByTxNameContaining(name);
    }
    
    @Transactional
    public void savePatientInfoData(List<Map<String, Object>> dataList) {
        List<PatientScheduleInfo> patientInfos = new ArrayList<>();
        
        for (Map<String, Object> data : dataList) {
            JsonNode dataNode = objectMapper.valueToTree(data);
            PatientScheduleInfo patientInfo = new PatientScheduleInfo();
            
            patientInfo.setCrbState(getStringValue(dataNode, "crb_state"));
            patientInfo.setFlag(getStringValue(dataNode, "flag"));
            patientInfo.setPbjlCount(getStringValue(dataNode, "pbjl_count"));
            patientInfo.setPbjlMonCount(getStringValue(dataNode, "pbjl_mon_count"));
            patientInfo.setTxAdd(getStringValue(dataNode, "tx_add"));
            patientInfo.setTxAge(getStringValue(dataNode, "tx_age"));
            patientInfo.setTxBedNumber(getStringValue(dataNode, "tx_bed_number"));
            patientInfo.setTxBingQu(getStringValue(dataNode, "tx_bing_qu"));
            patientInfo.setTxBxfs(getStringValue(dataNode, "tx_bxfs"));
            patientInfo.setTxComment(getStringValue(dataNode, "tx_comment"));
            patientInfo.setTxCrbxx(getStringValue(dataNode, "tx_crbxx"));
            patientInfo.setTxFirstDate(getStringValue(dataNode, "tx_first_date"));
            patientInfo.setTxGtz(getStringValue(dataNode, "tx_gtz"));
            patientInfo.setTxGzdw(getStringValue(dataNode, "tx_gzdw"));
            patientInfo.setTxHeight(getStringValue(dataNode, "tx_height"));
            patientInfo.setTxHyzk(getStringValue(dataNode, "tx_hyzk"));
            patientInfo.setTxMzid(getStringValue(dataNode, "tx_mzid"));
            patientInfo.setTxName(getStringValue(dataNode, "tx_name"));
            patientInfo.setTxNum(getStringValue(dataNode, "tx_num"));
            patientInfo.setTxNumber(getStringValue(dataNode, "tx_number"));
            patientInfo.setTxPhone(getStringValue(dataNode, "tx_phone"));
            patientInfo.setTxSex(getStringValue(dataNode, "tx_sex"));
            patientInfo.setTxState(getIntValue(dataNode, "tx_state"));
            patientInfo.setTxXueXing(getStringValue(dataNode, "tx_xue_xing"));
            patientInfo.setTxXueXingRh(getStringValue(dataNode, "tx_xue_xing_rh"));
            patientInfo.setTxYbno(getStringValue(dataNode, "tx_ybno"));
            patientInfo.setTxYoudaoqi(getStringValue(dataNode, "tx_youdaoqi"));
            patientInfo.setTxZjlx(getStringValue(dataNode, "tx_zjlx"));
            patientInfo.setTxZjno(getStringValue(dataNode, "tx_zjno"));
            patientInfo.setTxZyid(getStringValue(dataNode, "tx_zyid"));
            patientInfo.setCreatedAt(LocalDateTime.now());
            patientInfo.setUpdatedAt(LocalDateTime.now());
            
            patientInfos.add(patientInfo);
        }
        
        patientScheduleInfoRepository.saveAll(patientInfos);
    }
    
    @Transactional
    public void deleteByPatientNumber(String txNumber) {
        patientScheduleInfoRepository.deleteByTxNumber(txNumber);
    }
    
    private String getStringValue(JsonNode node, String fieldName) {
        if (node.has(fieldName) && !node.get(fieldName).isNull()) {
            return node.get(fieldName).asText();
        }
        return null;
    }
    
    private Integer getIntValue(JsonNode node, String fieldName) {
        if (node.has(fieldName) && !node.get(fieldName).isNull()) {
            return node.get(fieldName).asInt();
        }
        return null;
    }
}