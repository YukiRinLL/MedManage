package com.medmanage.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.medmanage.entity.DialysisSchedule;
import com.medmanage.repository.DialysisScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class DialysisScheduleService {
    
    @Autowired
    private DialysisScheduleRepository dialysisScheduleRepository;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    public List<DialysisSchedule> getAllSchedules() {
        return dialysisScheduleRepository.findAll();
    }
    
    public List<DialysisSchedule> getSchedulesByPatientId(String txTxjId) {
        return dialysisScheduleRepository.findByTxTxjId(txTxjId);
    }
    
    public List<DialysisSchedule> getSchedulesByPatientNumber(String number) {
        return dialysisScheduleRepository.findByNumber(number);
    }
    
    public List<DialysisSchedule> getSchedulesByWeek(Integer week) {
        return dialysisScheduleRepository.findByWeek(week);
    }
    
    public List<DialysisSchedule> getSchedulesByDate(String txPdrq) {
        return dialysisScheduleRepository.findByTxPdrq(txPdrq);
    }
    
    @Transactional
    public void saveScheduleData(Map<String, Object> data) {
        JsonNode dataNode = objectMapper.valueToTree(data.get("data"));
        
        List<DialysisSchedule> schedules = new ArrayList<>();
        dataNode.fields().forEachRemaining(entry -> {
            JsonNode scheduleNode = entry.getValue();
            DialysisSchedule schedule = new DialysisSchedule();
            
            schedule.setTxTxjId(getStringValue(scheduleNode, "tx_txjId"));
            schedule.setTxPdrq(getStringValue(scheduleNode, "tx_pdrq"));
            schedule.setTxPdrqType(getIntValue(scheduleNode, "tx_pdrqType"));
            schedule.setNumber(getStringValue(scheduleNode, "number"));
            schedule.setTxTxfsId(getIntValue(scheduleNode, "tx_txfsId"));
            schedule.setTxIsPermanent(getIntValue(scheduleNode, "tx_isPermanent"));
            schedule.setTxIsPause(getIntValue(scheduleNode, "tx_isPause"));
            schedule.setTxTxfsAlias(getStringValue(scheduleNode, "tx_txfsAlias"));
            schedule.setTxTxfsbm(getStringValue(scheduleNode, "tx_txfsbm"));
            schedule.setWeek(getIntValue(scheduleNode, "week"));
            schedule.setName(getStringValue(scheduleNode, "name"));
            schedule.setTxInfo(getStringValue(scheduleNode, "tx_info"));
            schedule.setTxXtcf(getStringValue(scheduleNode, "tx_xtcf"));
            schedule.setTxZljh(getStringValue(scheduleNode, "tx_zljh"));
            schedule.setTxTxqId(getStringValue(scheduleNode, "tx_txq_id"));
            schedule.setTxJhqId(getStringValue(scheduleNode, "tx_jhq_id"));
            schedule.setTxGlqId(getStringValue(scheduleNode, "tx_glq_id"));
            schedule.setTxXgtlId(getStringValue(scheduleNode, "tx_xgtl_id"));
            schedule.setTxTxq(getStringValue(scheduleNode, "tx_txq"));
            schedule.setTxDeviceSequence(getStringValue(scheduleNode, "tx_device_sequence"));
            schedule.setTxStatus(getIntValue(scheduleNode, "tx_status"));
            schedule.setTxCrbxx(getStringValue(scheduleNode, "tx_crbxx"));
            schedule.setTxJtstatus(getStringValue(scheduleNode, "tx_jtstatus"));
            schedule.setTxZlms(getStringValue(scheduleNode, "tx_zlms"));
            schedule.setTxUserid(getStringValue(scheduleNode, "tx_userid"));
            schedule.setHzStatus(getIntValue(scheduleNode, "hz_status"));
            schedule.setTxZyid(getStringValue(scheduleNode, "tx_zyid"));
            schedule.setTxMzid(getStringValue(scheduleNode, "tx_mzid"));
            schedule.setTxComment(getStringValue(scheduleNode, "tx_comment"));
            schedule.setCountFsId(getStringValue(scheduleNode, "count_fs_id"));
            schedule.setTxTxqjNamesQ(getStringValue(scheduleNode, "tx_txqj_names_q"));
            schedule.setTxPgNlid(getStringValue(scheduleNode, "tx_pg_nlid"));
            schedule.setTxPgDgid(getStringValue(scheduleNode, "tx_pg_dgid"));
            schedule.setTxPgZznames(getStringValue(scheduleNode, "tx_pg_zznames"));
            schedule.setTxPgBfznames(getStringValue(scheduleNode, "tx_pg_bfznames"));
            schedule.setTxPgThNlid(getStringValue(scheduleNode, "tx_pg_th_nlid"));
            schedule.setTxPgThDgid(getStringValue(scheduleNode, "tx_pg_th_dgid"));
            schedule.setTxPgThZznames(getStringValue(scheduleNode, "tx_pg_th_zznames"));
            schedule.setTxPgThBfznames(getStringValue(scheduleNode, "tx_pg_th_bfznames"));
            schedule.setTxNxIdH(getStringValue(scheduleNode, "tx_nx_id_h"));
            schedule.setCrb(getStringValue(scheduleNode, "crb"));
            schedule.setTxTxjMs(getStringValue(scheduleNode, "tx_txj_ms"));
            schedule.setTxBfType(getStringValue(scheduleNode, "tx_bf_type"));
            schedule.setTxZjno(getStringValue(scheduleNode, "tx_zjno"));
            schedule.setTxTxpl(getStringValue(scheduleNode, "tx_txpl"));
            schedule.setCreatedAt(LocalDateTime.now());
            schedule.setUpdatedAt(LocalDateTime.now());
            
            schedules.add(schedule);
        });
        
        dialysisScheduleRepository.saveAll(schedules);
    }
    
    @Transactional
    public void deleteByPatientId(String txTxjId) {
        dialysisScheduleRepository.deleteByTxTxjId(txTxjId);
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